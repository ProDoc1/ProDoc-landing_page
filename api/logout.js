import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Create table if not exists (This runs quickly if it exists)
        await sql`
            CREATE TABLE IF NOT EXISTS blacklisted_tokens (
                token TEXT PRIMARY KEY,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Invalidate token
        await sql`
            INSERT INTO blacklisted_tokens (token)
            VALUES (${token})
            ON CONFLICT (token) DO NOTHING;
        `;

        return res.status(200).json({ success: true, message: 'Session invalidated successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
