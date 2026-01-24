import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Map frontend names to database columns
  const { fullName, email, password } = req.body;

  try {
    await sql`
      INSERT INTO users (full_name, email, password)
      VALUES (${fullName}, ${email}, ${password});
    `;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Email already exists or database is down." });
  }
}