import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // In a real app, you must check for admin authentication here!
    // const token = req.headers.authorization; ...

    try {
        const { rows } = await sql`
      SELECT 
        r.*,
        d.full_name as doctor_name,
        d.image_url as doctor_image
      FROM doctor_ratings r
      JOIN doctors d ON r.doctor_id::text = d.doctor_id::text
      WHERE r.status = 'pending' OR r.status = 'rejected'
      ORDER BY r.created_at DESC;
    `;

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching pending reviews:", error);
        return res.status(500).json({ error: "Failed to fetch reviews" });
    }
}
