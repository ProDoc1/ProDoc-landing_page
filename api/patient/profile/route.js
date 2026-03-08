import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET - Fetch patient profile
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  
  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
  }
  
  try {
    const { rows } = await sql`
      SELECT id, full_name, email, phone, date_of_birth, gender, 
             address, emergency_contact, blood_type, allergies, 
             chronic_conditions, updated_at
      FROM patients 
      WHERE id = ${patientId}
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Transform database columns to camelCase
    const patient = rows[0];
    return NextResponse.json({
      id: patient.id,
      fullName: patient.full_name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      address: patient.address,
      emergencyContact: patient.emergency_contact,
      bloodType: patient.blood_type,
      allergies: patient.allergies || [],
      chronicConditions: patient.chronic_conditions || [],
      updatedAt: patient.updated_at
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update patient profile
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      patientId,
      fullName, 
      email, 
      phone, 
      dateOfBirth, 
      gender,
      address, 
      emergencyContact, 
      bloodType, 
      allergies, 
      chronicConditions 
    } = body;

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    }

    const { rows } = await sql`
      UPDATE patients 
      SET 
        full_name = ${fullName},
        email = ${email},
        phone = ${phone},
        date_of_birth = ${dateOfBirth},
        gender = ${gender},
        address = ${address},
        emergency_contact = ${emergencyContact},
        blood_type = ${bloodType},
        allergies = ${JSON.stringify(allergies || [])},
        chronic_conditions = ${JSON.stringify(chronicConditions || [])},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${patientId}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, patient: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}