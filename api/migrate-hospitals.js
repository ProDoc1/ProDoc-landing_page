import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.query.key !== 'migrate') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        // Attempt to add column directly - will fail if already exists but we catch it
        try {
            await sql`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS associated_hospitals JSONB DEFAULT '[]'::jsonb;`;
            console.log('Column associated_hospitals checked/added.');
        } catch (e) {
            console.log('Error adding column:', e.message);
        }

        // Migrate existing data
        await sql`
      UPDATE doctors 
      SET associated_hospitals = jsonb_build_array(
        jsonb_build_object(
          'name', working_hospital, 
          'type', department_type
        )
      )
      WHERE working_hospital IS NOT NULL 
      AND (associated_hospitals IS NULL OR associated_hospitals = '[]'::jsonb);
    `;

        return res.status(200).json({ success: true, message: 'Migration completed' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}