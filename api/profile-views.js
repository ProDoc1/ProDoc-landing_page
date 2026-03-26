import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { doctorId } = req.query;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS doctor_profile_views (
        id SERIAL PRIMARY KEY,
        doctor_id VARCHAR(255) NOT NULL,
        viewer_id VARCHAR(255),
        viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (req.method === 'POST') {
      if (!doctorId) return res.status(400).json({ error: 'Doctor ID is required' });

      await sql`
        INSERT INTO doctor_profile_views (doctor_id)
        VALUES (${doctorId});
      `;
      
      return res.status(200).json({ success: true, message: 'View recorded' });
    }

    if (req.method === 'GET') {
      if (!doctorId) return res.status(400).json({ error: 'Doctor ID is required' });

      const { rows } = await sql`
        SELECT COUNT(*) as count 
        FROM doctor_profile_views 
        WHERE doctor_id = ${doctorId}
      `;
      
      return res.status(200).json({ count: parseInt(rows[0].count) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Profile views error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
