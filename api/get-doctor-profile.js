import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    try {
        const { rows } = await sql`
      SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url
      FROM doctors 
      WHERE doctor_id = ${id};
    `;

        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res.status(404).json({ error: 'Doctor not found' });
        }
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
