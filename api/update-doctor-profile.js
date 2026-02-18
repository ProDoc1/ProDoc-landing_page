import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Handle CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id, name, specialty, slmcNumber, image_url, bio } = req.body || {};

  if (!id) return res.status(400).json({ error: 'Doctor ID is required' });

  try {
    // Verify doctor exists
    const existsRes = await sql`SELECT doctor_id FROM doctors WHERE doctor_id = ${id}`;
    const exists = existsRes?.rows || existsRes;
    if (!exists || exists.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Normalize incoming fields to DB column set (support common key variants)
    const body = req.body || {};
    const fields = {
      full_name: body.name ?? body.full_name ?? body.fullName,
      slmc_number: body.slmcNumber ?? body.slmc_number,
      specialty: body.specialty,
      gender: body.gender,
      department_type: body.departmentType ?? body.department_type,
      working_hospital: body.workingHospital ?? body.working_hospital ?? body['working hospital'],
      contact_email: body.contactEmail ?? body.contact_email,
      years_of_experience: body.yearsOfExperience ?? body.years_of_experience ?? body.years_of_experince,
      password: body.password,
      user_type: body.userType ?? body.user_type,
      image_url: body.image_url ?? body.image_URL ?? body.imageURL,
      associated_hospital: body.associated_hospital ?? body.assoiated_hospital ?? body.associatedHospital,
      bio: body.bio,
      second_opinion_available: body.secondOpinionAvailable ?? body.second_opinion_available,
      second_opinion_dates: body.secondOpinionDates ?? body.second_opinion_dates,
    };

    // Helper to check column exists in 'doctors' table
    async function columnExists(colName) {
      try {
        const colRes = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = ${colName}`;
        const rows = colRes?.rows || colRes;
        return rows && rows.length > 0;
      } catch (err) {
        // If information_schema isn't available, assume column exists to attempt update
        console.warn('Could not verify column existence for', colName, err?.message || err);
        return true;
      }
    }

    // Update each provided field only if the corresponding column exists
    if (fields.full_name !== undefined && await columnExists('full_name')) {
      await sql`UPDATE doctors SET full_name = ${fields.full_name} WHERE doctor_id = ${id}`;
    }
    if (fields.slmc_number !== undefined && await columnExists('slmc_number')) {
      await sql`UPDATE doctors SET slmc_number = ${fields.slmc_number} WHERE doctor_id = ${id}`;
    }
    if (fields.specialty !== undefined && await columnExists('specialty')) {
      await sql`UPDATE doctors SET specialty = ${fields.specialty} WHERE doctor_id = ${id}`;
    }
    if (fields.gender !== undefined && await columnExists('gender')) {
      await sql`UPDATE doctors SET gender = ${fields.gender} WHERE doctor_id = ${id}`;
    }
    if (fields.department_type !== undefined && await columnExists('department_type')) {
      await sql`UPDATE doctors SET department_type = ${fields.department_type} WHERE doctor_id = ${id}`;
    }
    if (fields.working_hospital !== undefined && await columnExists('working_hospital')) {
      await sql`UPDATE doctors SET working_hospital = ${fields.working_hospital} WHERE doctor_id = ${id}`;
    }
    if (fields.contact_email !== undefined && await columnExists('contact_email')) {
      await sql`UPDATE doctors SET contact_email = ${fields.contact_email} WHERE doctor_id = ${id}`;
    }
    if (fields.years_of_experience !== undefined && await columnExists('years_of_experience')) {
      await sql`UPDATE doctors SET years_of_experience = ${fields.years_of_experience} WHERE doctor_id = ${id}`;
    }
    if (fields.password !== undefined && await columnExists('password')) {
      await sql`UPDATE doctors SET password = ${fields.password} WHERE doctor_id = ${id}`;
    }
    if (fields.user_type !== undefined && await columnExists('user_type')) {
      await sql`UPDATE doctors SET user_type = ${fields.user_type} WHERE doctor_id = ${id}`;
    }
    if (fields.image_url !== undefined && await columnExists('image_url')) {
      await sql`UPDATE doctors SET image_url = ${fields.image_url} WHERE doctor_id = ${id}`;
    }
    if (fields.associated_hospital !== undefined && await columnExists('associated_hospital')) {
      await sql`UPDATE doctors SET associated_hospital = ${fields.associated_hospital} WHERE doctor_id = ${id}`;
    }
    if (fields.bio !== undefined && await columnExists('bio')) {
      await sql`UPDATE doctors SET bio = ${fields.bio} WHERE doctor_id = ${id}`;
    }
    if (fields.second_opinion_available !== undefined && await columnExists('second_opinion_available')) {
      await sql`UPDATE doctors SET second_opinion_available = ${fields.second_opinion_available} WHERE doctor_id = ${id}`;
    }
    if (fields.second_opinion_dates !== undefined && await columnExists('second_opinion_dates')) {
      await sql`UPDATE doctors SET second_opinion_dates = ${fields.second_opinion_dates} WHERE doctor_id = ${id}`;
    }

    // Return refreshed doctor record with consistent field names
    const updatedRes = await sql`
      SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url, bio
      FROM doctors WHERE doctor_id = ${id}
    `;
    const updated = updatedRes?.rows ? updatedRes.rows[0] : updatedRes[0];

    return res.status(200).json({ success: true, doctor: updated });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}