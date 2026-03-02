// Doctor login — email/password against doctors table
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const INVALID_CREDENTIALS_MSG = 'Invalid email or password.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email: rawEmail, password } = req.body || {};
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  try {
    const result = await sql`
      SELECT doctor_id, full_name, contact_email, password
      FROM doctors
      WHERE LOWER(TRIM(contact_email)) = ${email}
      LIMIT 1
    `;
    const doctor = result.rows[0];

    if (!doctor) {
      return res.status(401).json({ error: INVALID_CREDENTIALS_MSG });
    }

    const storedPassword = doctor.password;
    if (!storedPassword) {
      return res.status(401).json({ error: 'This account uses Google sign-in. Please use "Sign in with Google".' });
    }

    const match = await bcrypt.compare(password, storedPassword);
    if (!match) {
      return res.status(401).json({ error: INVALID_CREDENTIALS_MSG });
    }

    return res.status(200).json({
      success: true,
      role: 'doctor',
      user: {
        id: doctor.doctor_id,
        fullName: doctor.full_name,
        email: doctor.contact_email,
        name: doctor.full_name,
      },
    });
  } catch (err) {
    console.error('Doctor login error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
