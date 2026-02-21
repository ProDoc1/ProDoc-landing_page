import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { action } = req.query;

    switch (action) {
        case 'doctor-login':
            return handleDoctorLogin(req, res);
        case 'forgot-password':
            return handleForgotPassword(req, res);
        case 'reset-password':
            return handleResetPassword(req, res);
        case 'update-password':
            return handleUpdatePassword(req, res);
        default:
            return res.status(400).json({ error: 'Invalid action parameter' });
    }
}

async function handleDoctorLogin(req, res) {
    const { email, password } = req.body;
    try {
        const { rows } = await sql`
      SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url
      FROM doctors 
      WHERE contact_email = ${email} AND password = ${password};
    `;

        if (rows.length > 0) {
            const doctor = rows[0];
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

async function handleForgotPassword(req, res) {
    const { email, role } = req.body;
    if (!email || !role) {
        return res.status(400).json({ error: 'Email and role are required' });
    }

    try {
        let user;
        if (role === 'doctor') {
            const result = await sql`SELECT * FROM doctors WHERE contact_email = ${email}`;
            user = result.rows[0];
        } else {
            const result = await sql`SELECT * FROM users WHERE email = ${email}`;
            user = result.rows[0];
        }

        if (!user) {
            return res.status(200).json({ success: true, message: 'If an account exists, a code has been sent.' });
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 15 * 60 * 1000;

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

async function handleResetPassword(req, res) {
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

async function handleUpdatePassword(req, res) {
    const { id, newPassword } = req.body;
    if (!id || !newPassword) {
        return res.status(400).json({ error: 'Doctor ID and new password are required' });
    }

    try {
        const result = await sql`
            UPDATE doctors 
            SET password = ${newPassword} 
            WHERE doctor_id = ${id}
            RETURNING doctor_id;
        `;

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
