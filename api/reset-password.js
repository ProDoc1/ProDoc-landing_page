import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, code, newPassword, role } = req.body;

    if (!email || !code || !newPassword || !role) {
        return res.status(400).json({ error: 'Missing required configuration' });
    }

    try {
        const { rows } = await sql`
            SELECT * FROM password_resets 
            WHERE email = ${email} AND code = ${code} AND expires_at > NOW()
        `;

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (role === 'patient') {
            await sql`UPDATE users SET password = ${hashedPassword} WHERE email = ${email}`;
        } else if (role === 'doctor') {
            await sql`UPDATE doctors SET password = ${hashedPassword} WHERE contact_email = ${email}`;
        }

        // Delete the used reset code
        await sql`DELETE FROM password_resets WHERE email = ${email}`;

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
