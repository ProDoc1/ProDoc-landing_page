import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const result = await sql`
      UPDATE doctor_ratings
      SET user_name = users.full_name
      FROM users
      WHERE doctor_ratings.user_id::text = users.id::text
      AND (doctor_ratings.user_name = 'Verified User' OR doctor_ratings.user_name IS NULL OR doctor_ratings.user_name = '')
    `;
    
    return res.status(200).json({ 
      message: "Database sync complete", 
      updatedRows: result.rowCount 
    });
  } catch (error) {
    console.error("Database sync failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
