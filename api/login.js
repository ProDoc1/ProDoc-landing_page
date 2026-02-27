import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'prodoc-secure-secret-key-2024';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password, userType } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        if (userType === 'patient') {
            const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            let isPasswordValid = false;
            if (user.password && user.password.startsWith('$2')) {
                isPasswordValid = await bcrypt.compare(password, user.password);
            } else {
                isPasswordValid = (password === user.password);
            }

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: 'patient', fullName: user.full_name },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return res.status(200).json({
                success: true,
                user: { id: user.id, name: user.full_name, email: user.email },
                token
            });

        } else if (userType === 'doctor') {
            const { rows } = await sql`SELECT * FROM doctors WHERE contact_email = ${email}`;
            const doctor = rows[0];

            if (!doctor) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            if (!doctor.password) {
                return res.status(401).json({ error: 'Doctor account not properly configured for login. Please reset password.' });
            }

            let isPasswordValid = false;
            if (doctor.password.startsWith('$2')) {
                isPasswordValid = await bcrypt.compare(password, doctor.password);
            } else {
                isPasswordValid = (password === doctor.password);
            }

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { id: doctor.doctor_id, email: doctor.contact_email, role: 'doctor', fullName: doctor.full_name },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return res.status(200).json({
                success: true,
                user: { ...doctor, id: doctor.doctor_id, name: doctor.full_name, email: doctor.contact_email },
                token
            });
        } else if (userType === 'admin') {
            const { rows } = await sql`SELECT * FROM admins WHERE username = ${email}`;
            const admin = rows[0];

            if (!admin) {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }

            const token = jwt.sign(
                { id: admin.id, username: admin.username, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                success: true,
                user: { id: admin.id, name: 'System Admin', email: admin.username, role: 'admin' },
                token
            });
        }

        return res.status(400).json({ error: 'Invalid user type' });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
