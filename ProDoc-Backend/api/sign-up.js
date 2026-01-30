import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, email, password } = req.body;

  try {
    // 1. Generate a salt and hash the password
    // The '10' is the cost factor (rounds), which determines how secure the hash is.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert the HASHED password into the database
    await sql`
      INSERT INTO users (full_name, email, password)
      VALUES (${fullName}, ${email}, ${hashedPassword});
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    // Standard error for duplicate emails
    return res.status(500).json({ error: "Email already exists or database is down." });
  }
}