import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET - Fetch patient profile
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const email = searchParams.get('email');

    let result;
    if (patientId && patientId !== 'undefined') {
      result = await sql`SELECT * FROM patients WHERE id = ${patientId}`;
    } else if (email) {
      result = await sql`SELECT * FROM patients WHERE email = ${email}`;
    } else {
      return NextResponse.json({ error: 'Patient ID or Email required' }, { status: 400 });
    }

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    const patient = result.rows[0];
    return NextResponse.json({
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
      email_verified: patient.email_verified || false
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update patient profile
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email: bodyEmail, 
      phone, 
      dateOfBirth, 
      gender, 
      address, 
      emergencyContact, 
      bloodType, 
      allergies, 
      chronicConditions 
    } = body;

    // Get email from body or query
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const targetEmail = bodyEmail || queryEmail;

    if (!targetEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const safeDob = dateOfBirth && dateOfBirth.trim() !== '' ? dateOfBirth : null;
    const safeAllergies = Array.isArray(allergies) ? allergies : [];
    const safeConditions = Array.isArray(chronicConditions) ? chronicConditions : [];

    // Check if user exists
    const existingUser = await sql`SELECT id FROM patients WHERE email = ${targetEmail}`;

    let result;
    if (existingUser.rows.length > 0) {
      // Update existing
      result = await sql`
        UPDATE patients 
        SET full_name = ${fullName || ''}, 
            phone = ${phone || ''}, 
            date_of_birth = ${safeDob},
            gender = ${gender || ''}, 
            address = ${address || ''}, 
            emergency_contact = ${emergencyContact || ''},
            blood_type = ${bloodType || ''}, 
            allergies = ${safeAllergies}::text[], 
            chronic_conditions = ${safeConditions}::text[], 
            updated_at = CURRENT_TIMESTAMP
        WHERE email = ${targetEmail} 
        RETURNING *`;
    } else {
      // Insert new
      result = await sql`
        INSERT INTO patients (full_name, email, phone, date_of_birth, gender, address, emergency_contact, blood_type, allergies, chronic_conditions)
        VALUES (${fullName || ''}, ${targetEmail}, ${phone || ''}, ${safeDob}, ${gender || ''}, ${address || ''}, ${emergencyContact || ''}, ${bloodType || ''}, ${safeAllergies}::text[], ${safeConditions}::text[])
        RETURNING *`;
    }

    return NextResponse.json({ success: true, patient: result.rows[0] });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// OPTIONS for CORS
export async function OPTIONS(request) {
  return NextResponse.json({}, { status: 200 });
}