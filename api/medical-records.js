import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { patientId } = req.query;

  if (req.method === 'GET') {
    if (!patientId) return res.status(400).json({ error: 'Patient ID required' });
    try {
      const { rows } = await sql`
        SELECT * FROM medical_records 
        WHERE patient_id = ${patientId} 
        ORDER BY created_at DESC
      `;
      // Format dates for frontend
      const records = rows.map(r => ({
        ...r,
        reportDate: r.report_date ? new Date(r.report_date).toISOString().split('T')[0] : null,
        doctorName: 'Self Uploaded', // Assuming these are self-uploaded for now
        hospital: 'Personal Records'
      }));
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { patientId, title, type, url, fileSize, status } = req.body;
    if (!patientId || !title || !url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const { rows } = await sql`
        INSERT INTO medical_records (patient_id, title, type, url, file_size, status)
        VALUES (${patientId}, ${title}, ${type}, ${url}, ${fileSize}, ${status || 'Encrypted'})
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
