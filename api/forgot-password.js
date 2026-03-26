import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, role } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        let userExists = false;

        if (role === 'patient') {
            const { rows } = await sql`SELECT id FROM users WHERE email = ${email}`;
            userExists = rows.length > 0;
        } else if (role === 'doctor') {
            const { rows } = await sql`SELECT doctor_id FROM doctors WHERE contact_email = ${email}`;
            userExists = rows.length > 0;
        }

        if (!userExists) {
            return res.status(404).json({ error: 'Account not found with this email' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Uses password_resets table (email PK) with 15-minute expiry. Upserts on repeated requests.
        await sql`
            CREATE TABLE IF NOT EXISTS password_resets (
                email VARCHAR(255) PRIMARY KEY,
                code VARCHAR(10) NOT NULL,
                expires_at TIMESTAMP NOT NULL
            );
        `;

        await sql`
            INSERT INTO password_resets (email, code, expires_at)
            VALUES (${email}, ${resetCode}, NOW() + INTERVAL '15 minutes')
            ON CONFLICT (email) DO UPDATE 
            SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at;
        `;

        return res.status(200).json({ success: true, resetCode });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
