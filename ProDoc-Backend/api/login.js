import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prodoc-secure-secret-key-2024';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  try {
    // 1. Search for the user by email
    const result = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    const user = result.rows[0];

    // 2. Security Check: Compare the plain text password with the hashed password from the DB
    if (user && await bcrypt.compare(password, user.password)) {

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: 'patient',
          fullName: user.full_name
        },
        JWT_SECRET,
        { expiresIn: '30d' } // Persistent for 30 days
      );

      // Return success with token
      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, fullName: user.full_name, email: user.email }
      });
    } else {
      // Return same generic error for both wrong email and wrong password for security
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}