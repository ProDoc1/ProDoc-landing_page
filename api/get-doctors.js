// api/get-doctors.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Disable caching to ensure we always get the latest data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // This fetches your doctors. The associated_hospitals are now stored 
    // directly in a JSONB column in this table.
    // Use a subquery to calculate ratings to avoid complex GROUP BY clauses and column listing issues
    const { rows } = await sql`
      SELECT 
        d.*,
        COALESCE(r.avg_rating, 0) as average_rating,
        COALESCE(r.count, 0) as rating_count
      FROM doctors d
      LEFT JOIN (
        SELECT 
          doctor_id, 
          AVG(overall) as avg_rating, 
          COUNT(id) as count 
        FROM doctor_ratings 
        WHERE status = 'approved' OR status IS NULL
        GROUP BY doctor_id
      ) r ON d.doctor_id::text = r.doctor_id::text
      ORDER BY d.full_name ASC;
    `;

    // Send the data back to your doctor.jsx file
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Failed to fetch doctors" });
  }
}