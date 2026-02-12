import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password } = req.body;

    try {
        // Query matching the provided instructions but adapting to likely existing column names

        const { rows } = await sql`
      SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url
      FROM doctors 
      WHERE contact_email = ${email} AND password = ${password};
    `;

        if (rows.length > 0) {
            const doctor = rows[0];

            // Generate Token
            const token = jwt.sign(
                {
                    id: doctor.id,
                    email: doctor.email,
                    role: 'doctor',
                    fullName: doctor.name
                },
                process.env.JWT_SECRET || 'prodoc-secure-secret-key-2024',
                { expiresIn: '30d' }
            );

            // Login successful
            return res.status(200).json({
                success: true,
                token,
                user: doctor,
                role: 'doctor'
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}