import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        if (role === 'patient') {
            await sql`UPDATE users SET email_verified = TRUE WHERE email = ${email}`;
        } else if (role === 'doctor') {
            await sql`UPDATE doctors SET email_verified = TRUE WHERE contact_email = ${email}`;
        } else {
            return res.status(400).json({ error: 'Invalid role' });
        }

        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
