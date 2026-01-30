// api/get-doctors.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // This fetches your 50 doctors from the Postgres table you created
    const { rows } = await sql`SELECT * FROM doctors ORDER BY full_name ASC`;
    
    // Send the data back to your doctor.jsx file
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Failed to fetch doctors" });
  }
}