import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Ensure patient_email column exists
  try {
    await sql`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS patient_email TEXT`;
  } catch (e) { /* already exists */ }

  const { patientId, email } = req.query;

  if (req.method === 'GET') {
    if (!patientId && !email) return res.status(400).json({ error: 'Patient ID or Email required' });
    try {
      let rows = [];

      if (patientId && email) {
        // Best case: fetch by both patientId AND email (covers UUID and integer ID mismatches)
        const result = await sql`
          SELECT * FROM medical_records 
          WHERE CAST(patient_id AS TEXT) = CAST(${patientId} AS TEXT)
             OR patient_email = ${email}
          ORDER BY created_at DESC
        `;
        rows = result.rows;
      } else if (patientId) {
        const result = await sql`
          SELECT * FROM medical_records 
          WHERE CAST(patient_id AS TEXT) = CAST(${patientId} AS TEXT)
          ORDER BY created_at DESC
        `;
        rows = result.rows;
      } else if (email) {
        // Fallback: fetch by email directly from medical_records
        const byEmail = await sql`
          SELECT * FROM medical_records
          WHERE patient_email = ${email}
          ORDER BY created_at DESC
        `;
        rows = byEmail.rows;

        // Also try joining with users table to cover old records without patient_email
        if (rows.length === 0) {
          const joined = await sql`
            SELECT m.* FROM medical_records m
            JOIN users u ON CAST(m.patient_id AS TEXT) = CAST(u.id AS TEXT)
            WHERE u.email = ${email}
            ORDER BY m.created_at DESC
          `;
          rows = joined.rows;
        }
      }

      const records = rows.map(r => ({
        ...r,
        reportDate: r.report_date ? new Date(r.report_date).toISOString().split('T')[0] : null,
        doctorName: 'Self Uploaded',
        hospital: 'Personal Records'
      }));
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { patientId, patientEmail, title, type, url, fileSize, status } = req.body;
    if (!title || !url || (!patientId && !patientEmail)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const { rows } = await sql`
        INSERT INTO medical_records (patient_id, patient_email, title, type, url, file_size, status)
        VALUES (${patientId || null}, ${patientEmail || null}, ${title}, ${type}, ${url}, ${fileSize}, ${status || 'Encrypted'})
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Record ID required' });
    try {
      await sql`DELETE FROM medical_records WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
