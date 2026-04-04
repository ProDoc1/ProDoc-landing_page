import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    await sql`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS patient_email TEXT`;

    // Fix the 2 orphaned records: assign them to Nethmin Gomes (njxbeast10@gmail.com)
    // user_id = 4c17641e-cce5-4e16-ab5b-786a44d05976
    const fix = await sql`
      UPDATE medical_records
      SET patient_id = '4c17641e-cce5-4e16-ab5b-786a44d05976',
          patient_email = 'njxbeast10@gmail.com'
      WHERE patient_id = '79ea59fb-5c8d-4613-8f42-0e44ca2e30b8'
    `;

    // Also backfill all other records where email is null but can be joined
    await sql`
      UPDATE medical_records m
      SET patient_email = u.email
      FROM users u
      WHERE CAST(m.patient_id AS TEXT) = CAST(u.id AS TEXT)
        AND (m.patient_email IS NULL OR m.patient_email = '')
    `;

    // Show current state
    const records = await sql`SELECT id, patient_id, patient_email, title FROM medical_records ORDER BY created_at DESC LIMIT 20`;
    
    return res.status(200).json({
      fixed: fix.rowCount,
      records: records.rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
