import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, email, password } = req.body || {};

  // Trim and normalize inputs
  const trimmedName = fullName ? String(fullName).trim() : '';
  const trimmedEmail = email ? String(email).trim().toLowerCase() : '';

  // Basic validation
  if (!trimmedName || !trimmedEmail || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Check if email already exists (use normalized email)
    const existing = await sql`SELECT id FROM users WHERE email = ${trimmedEmail} LIMIT 1`;
    if (existing && Array.isArray(existing.rows) && existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 1. Generate a salt and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Insert the HASHED password into the database
    await sql`
      INSERT INTO users (full_name, email, password)
      VALUES (${trimmedName}, ${trimmedEmail}, ${hashedPassword});
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    // Return a generic server error without crashing
    return res.status(500).json({ error: "Internal server error" });
  }
}