import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs'; // Use import at the top for cleaner code

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
    // bcrypt.compare() automatically handles the salt and decryption check
    if (user && await bcrypt.compare(password, user.password)) {
      
      // Return success without sending back the password field
      return res.status(200).json({ 
        success: true, 
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