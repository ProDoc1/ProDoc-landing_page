import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prodoc-secure-secret-key-2024';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { fullName, email, password, publicKey } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertResult = await sql`
            INSERT INTO users (full_name, email, password, public_key)
            VALUES (${fullName}, ${email}, ${hashedPassword}, ${publicKey || null})
            RETURNING id, full_name, email, public_key;
        `;

        const user = insertResult.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'patient', fullName: user.full_name, publicKey: user.public_key },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(201).json({
            success: true,
            user,
            token
        });

    } catch (error) {
        console.error('Sign-up error:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
