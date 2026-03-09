import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Manual CORS/Method handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { patientId, email } = req.query;

  if (req.method === 'GET') {
    try {
      let result;
      if (patientId && patientId !== 'undefined') {
        result = await sql`SELECT * FROM patients WHERE id = ${patientId}`;
      } else if (email) {
        result = await sql`SELECT * FROM patients WHERE email = ${email}`;
      } else {
        return res.status(400).json({ error: 'Patient ID or Email required' });
      }

      if (!result || result.rows.length === 0) {
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
        chronicConditions: patient.chronic_conditions || []
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { fullName, email: bodyEmail, phone, dateOfBirth, gender, address, emergencyContact, bloodType, allergies, chronicConditions } = req.body;
      const targetEmail = bodyEmail || email;

      if (!targetEmail) return res.status(400).json({ error: 'Email is required' });

      const safeDob = dateOfBirth && dateOfBirth.trim() !== '' ? dateOfBirth : null;
      const safeAllergies = Array.isArray(allergies) ? allergies : [];
      const safeConditions = Array.isArray(chronicConditions) ? chronicConditions : [];

      const existingUser = await sql`SELECT id FROM patients WHERE email = ${targetEmail}`;

      let result;
      if (existingUser.rows.length > 0) {
        result = await sql`
          UPDATE patients 
          SET full_name = ${fullName || ''}, phone = ${phone || ''}, date_of_birth = ${safeDob},
              gender = ${gender || ''}, address = ${address || ''}, emergency_contact = ${emergencyContact || ''},
              blood_type = ${bloodType || ''}, allergies = ${safeAllergies}::text[], 
              chronic_conditions = ${safeConditions}::text[], updated_at = CURRENT_TIMESTAMP
          WHERE email = ${targetEmail} RETURNING *`;
      } else {
        result = await sql`
          INSERT INTO patients (full_name, email, phone, date_of_birth, gender, address, emergency_contact, blood_type, allergies, chronic_conditions)
          VALUES (${fullName || ''}, ${targetEmail}, ${phone || ''}, ${safeDob}, ${gender || ''}, ${address || ''}, ${emergencyContact || ''}, ${bloodType || ''}, ${safeAllergies}::text[], ${safeConditions}::text[])
          RETURNING *`;
      }
      return res.status(200).json({ success: true, patient: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}