import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  try {
    // Search for the user by email
    const result = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    const user = result.rows[0];

    // Check if user exists and password matches
    if (user && user.password === password) {
      // In a real app, you'd use a JWT token here, but for now, we'll return success
      return res.status(200).json({ 
        success: true, 
        user: { id: user.id, fullName: user.full_name, email: user.email } 
      });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
}