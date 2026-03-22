import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Manual CORS/Method handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { patientId, email } = req.query;

  // ENSURE TABLE & COLUMNS EXIST (Auto-Migration)
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
  } catch (e) {
    console.warn("Migration notice:", e.message);
  }

  if (req.method === 'GET') {
    try {
      let result;
      // Robust lookup: prefer ID if specific, but always allow fallback to Email
      if (patientId && patientId !== 'undefined') {
        result = await sql`SELECT * FROM patients WHERE id = ${patientId} OR email = ${email}`;
      } else if (email) {
        result = await sql`SELECT * FROM patients WHERE email = ${email}`;
      } else {
        return res.status(400).json({ error: 'Patient ID or Email required' });
      }

      if (!result || result.rows.length === 0) {
        // If not found in patients table, check if they exist in users table to potentially auto-create
        const userCheck = await sql`SELECT full_name, email FROM users WHERE email = ${email}`;
        if (userCheck.rows.length > 0) {
            const u = userCheck.rows[0];
            return res.status(200).json({
                fullName: u.full_name,
                email: u.email,
                phone: '', dateOfBirth: '', gender: '', address: '', emergencyContact: '', bloodType: '',
                allergies: [], chronicConditions: [], imageUrl: ''
            });
        }
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const patient = result.rows[0];
      return res.status(200).json({
        id: patient.id,
        fullName: patient.full_name,
        email: patient.email,
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
      const { fullName, email: bodyEmail, phone, dateOfBirth, gender, address, emergencyContact, bloodType, allergies, chronicConditions, imageUrl } = req.body;
      const targetEmail = bodyEmail || email;

      if (!targetEmail) return res.status(400).json({ error: 'Email is required' });

      const safeDob = dateOfBirth && dateOfBirth.trim() !== '' ? dateOfBirth : null;
      const safeAllergies = Array.isArray(allergies) ? allergies : [];
      const safeConditions = Array.isArray(chronicConditions) ? chronicConditions : [];

      // Use UPSERT (INSERT ... ON CONFLICT)
      const result = await sql`
        INSERT INTO patients (
          full_name, email, phone, date_of_birth, gender, address, 
          emergency_contact, blood_type, allergies, chronic_conditions, image_url
        )
        VALUES (
          ${fullName || ''}, ${targetEmail}, ${phone || ''}, ${safeDob}, ${gender || ''}, ${address || ''}, 
          ${emergencyContact || ''}, ${bloodType || ''}, ${safeAllergies}::text[], ${safeConditions}::text[], ${imageUrl || null}
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
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`;

      return res.status(200).json({ success: true, patient: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}