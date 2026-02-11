import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, code, newPassword, role } = req.body;

    if (!email || !code || !newPassword || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        let user;
        if (role === 'doctor') {
            const result = await sql`
        SELECT * FROM doctors 
        WHERE contact_email = ${email} 
          AND reset_token = ${code} 
          AND reset_token_expiry > ${Date.now()}
      `;
            user = result.rows[0];
        } else {
            const result = await sql`
        SELECT * FROM users 
        WHERE email = ${email} 
          AND reset_token = ${code} 
          AND reset_token_expiry > ${Date.now()}
      `;
            user = result.rows[0];
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        let passwordToStore = newPassword;
        if (role !== 'doctor') {
            const salt = await bcrypt.genSalt(10);
            passwordToStore = await bcrypt.hash(newPassword, salt);
        }

        if (role === 'doctor') {
            await sql`
        UPDATE doctors 
        SET password = ${passwordToStore}, reset_token = NULL, reset_token_expiry = NULL
        WHERE contact_email = ${email}
      `;
        } else {
            await sql`
        UPDATE users 
        SET password = ${passwordToStore}, reset_token = NULL, reset_token_expiry = NULL
        WHERE email = ${email}
      `;
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
