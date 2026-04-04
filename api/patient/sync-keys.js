import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, publicKey, privateKey } = req.body;

  if (!email || !privateKey) {
    return res.status(400).json({ error: 'Email and privateKey are required' });
  }

  try {
    // Migration: ensure private_key column exists
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS private_key TEXT;`;
    
    await sql`
      UPDATE users 
      SET public_key = COALESCE(public_key, ${publicKey}),
          private_key = ${privateKey}
      WHERE email = ${email}
    `;
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
