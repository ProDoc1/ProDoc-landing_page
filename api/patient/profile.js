import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { patientId, email } = req.query;

  try {
    await sql`CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS phone TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS date_of_birth DATE`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS address TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS blood_type TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT[]`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[]`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS image_url TEXT`;
    await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
  } catch (e) {
    console.warn("Migration notice:", e.message);
  }

  if (req.method === 'GET') {
    try {
      let result;
      if (patientId && patientId !== 'undefined') {
        result = await sql`SELECT * FROM patients WHERE id = ${patientId} OR email = ${email}`;
      } else if (email) {
        result = await sql`SELECT * FROM patients WHERE email = ${email}`;
      } else {
        return res.status(400).json({ error: 'Patient ID or Email required' });
      }

      const patient = (result && result.rows.length > 0) ? result.rows[0] : null;
      
      // If patient row exists in patients table, combine with verified status from users table
      const userCheck = await sql`SELECT full_name, email, email_verified FROM users WHERE email = ${email}`;
      const userRow = userCheck.rows[0];

      if (!patient && !userRow) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const finalEmailVerified = userRow ? userRow.email_verified : (patient ? patient.email_verified : false);

      if (!patient) {
          return res.status(200).json({
              fullName: userRow.full_name,
              email: userRow.email,
              email_verified: finalEmailVerified,
              phone: '', dateOfBirth: '', gender: '', address: '', emergencyContact: '', bloodType: '',
              allergies: [], chronicConditions: [], imageUrl: ''
          });
      }

      return res.status(200).json({
        id: patient.id,
        fullName: patient.full_name,
        email: patient.email,
        email_verified: finalEmailVerified,
        phone: patient.phone || '',
        dateOfBirth: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        address: patient.address || '',
        emergencyContact: patient.emergency_contact || '',
        bloodType: patient.blood_type || '',
        allergies: patient.allergies || [],
        chronicConditions: patient.chronic_conditions || [],
        imageUrl: patient.image_url || ''
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { fullName, email: bodyEmail, phone, dateOfBirth, gender, address, emergencyContact, bloodType, allergies, chronicConditions, imageUrl, email_verified } = req.body;
      const targetEmail = bodyEmail || email;

      if (!targetEmail) return res.status(400).json({ error: 'Email is required' });

      const safeDob = dateOfBirth && dateOfBirth.trim() !== '' ? dateOfBirth : null;
      const safeAllergies = Array.isArray(allergies) ? allergies : [];
      const safeConditions = Array.isArray(chronicConditions) ? chronicConditions : [];

      const result = await sql`
        INSERT INTO patients (
          full_name, email, phone, date_of_birth, gender, address, 
          emergency_contact, blood_type, allergies, chronic_conditions, image_url, email_verified
        )
        VALUES (
          ${fullName || ''}, ${targetEmail}, ${phone || ''}, ${safeDob}, ${gender || ''}, ${address || ''}, 
          ${emergencyContact || ''}, ${bloodType || ''}, ${safeAllergies}::text[], ${safeConditions}::text[], ${imageUrl || null}, ${email_verified || false}
        )
        ON CONFLICT (email) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          phone = EXCLUDED.phone,
          date_of_birth = EXCLUDED.date_of_birth,
          gender = EXCLUDED.gender,
          address = EXCLUDED.address,
          emergency_contact = EXCLUDED.emergency_contact,
          blood_type = EXCLUDED.blood_type,
          allergies = EXCLUDED.allergies,
          chronic_conditions = EXCLUDED.chronic_conditions,
          image_url = EXCLUDED.image_url,
          email_verified = EXCLUDED.email_verified,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`;

      return res.status(200).json({ success: true, patient: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { email: queryEmail, password, patientId } = req.query;
    const body = req.body || {};
    const targetEmail = body.email || queryEmail;
    const targetPassword = body.password || password;
    const targetPatientId = body.patientId || patientId;

    if (!targetEmail || !targetPassword) {
      return res.status(400).json({ error: 'Email and password are required for account deletion' });
    }

    try {
      const userResult = await sql`SELECT * FROM users WHERE email = ${targetEmail}`;
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const bcrypt = require('bcryptjs');
      let isPasswordValid = false;
      if (user.password && user.password.startsWith('$2')) {
        isPasswordValid = await bcrypt.compare(targetPassword, user.password);
      } else {
        isPasswordValid = (targetPassword === user.password);
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const userId = user.id;

      await sql`DELETE FROM medical_records WHERE patient_id = ${userId}`;
      await sql`DELETE FROM medical_records WHERE patient_email = ${targetEmail}`;
      await sql`DELETE FROM doctor_ratings WHERE user_id = ${userId}`;
      await sql`DELETE FROM saved_doctors WHERE patient_id = ${userId}`;
      await sql`DELETE FROM second_opinion_requests WHERE patient_id = ${userId}`;
      await sql`DELETE FROM profile_views WHERE user_id = ${userId}`;
      await sql`DELETE FROM users WHERE id = ${userId}`;

      return res.status(200).json({ success: true, message: 'Account and all medical records deleted permanently' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}