import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        // 1. Check if user exists
        let user;
        if (role === 'doctor') {
            const result = await sql`SELECT * FROM doctors WHERE contact_email = ${email}`;
            user = result.rows[0];
        } else {
            const result = await sql`SELECT * FROM users WHERE email = ${email}`;
            user = result.rows[0];
        }

        if (!user) {
            // For security, do not reveal if email exists or not
            return res.status(200).json({ success: true, message: 'If an account exists, a code has been sent.' });
        }

        // 2. Generate generic 6-digit code
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        // 3. Save token to DB
        if (role === 'doctor') {
            await sql`
        UPDATE doctors 
        SET reset_token = ${token}, reset_token_expiry = ${expiry}
        WHERE contact_email = ${email}
      `;
        } else {
            await sql`
        UPDATE users 
        SET reset_token = ${token}, reset_token_expiry = ${expiry}
        WHERE email = ${email}
      `;
        }

        // 4. Return token to frontend so EmailJS can send it
        return res.status(200).json({
            success: true,
            message: 'Code generated successfully',
            resetCode: token
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
