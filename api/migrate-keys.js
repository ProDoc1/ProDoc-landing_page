import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS private_key TEXT;`;
    return res.status(200).json({ success: true, message: 'Column added (or already exists)' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
