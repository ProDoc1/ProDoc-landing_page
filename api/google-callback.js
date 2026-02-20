import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'prodoc-secure-secret-key-2024';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { token, role = 'patient' } = req.body;

    if (!token) return res.status(400).json({ error: 'Token is required' });

    try {
        // 1. Verify Google Access Token (OAuth2)
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!googleResponse.ok) {
            return res.status(401).json({ error: 'Invalid Google Token' });
        }

        const googleUser = await googleResponse.json();
        const { email, name, sub: googleId } = googleUser;

        if (!email) return res.status(400).json({ error: 'Email not found in Google account' });

        // 2. Handle User/Doctor Logic
        if (role === 'patient') {
            const result = await sql`SELECT * FROM users WHERE email = ${email}`;
            let user = result.rows[0];

            if (!user) {
                // Sign Up (Create User)
                // Create a secure random password for the user since they are using Google Auth
                const randomPassword = Math.random().toString(36).slice(-8) + googleId;
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                const insertResult = await sql`
                INSERT INTO users (full_name, email, password)
                VALUES (${name}, ${email}, ${hashedPassword})
                RETURNING id, full_name, email;
            `;
                user = insertResult.rows[0];
            }

            // Generate App JWT
            const appToken = jwt.sign(
                { id: user.id, email: user.email, role: 'patient', fullName: user.full_name },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return res.status(200).json({
                success: true,
                token: appToken,
                user: { id: user.id, fullName: user.full_name, email: user.email },
                role: 'patient'
            });

        } else if (role === 'doctor') {
            // Query doctors table
            const result = await sql`SELECT * FROM doctors WHERE contact_email = ${email}`;
            const doctor = result.rows[0];

            if (!doctor) {
                return res.status(404).json({ error: "No doctor account found with this email. Please register via standard process." });
            }

            // Generate Token
            const appToken = jwt.sign(
                { id: doctor.doctor_id, email: doctor.contact_email, role: 'doctor', fullName: doctor.full_name },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return res.status(200).json({
                success: true,
                token: appToken,
                user: { ...doctor, id: doctor.doctor_id, name: doctor.full_name, email: doctor.contact_email },
                role: 'doctor'
            });
        } else {
            return res.status(400).json({ error: 'Invalid role' });
        }

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ error: "Internal server error: " + error.message });
    }
}
