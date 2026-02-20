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
    const { rows } = await sql`SELECT * FROM doctors ORDER BY full_name ASC`;

    // Send the data back to your doctor.jsx file
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Failed to fetch doctors" });
  }
}