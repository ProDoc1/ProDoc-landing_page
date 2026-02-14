import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      patientId, 
      fullName, 
      email, 
      phone, 
      dateOfBirth, 
      address,
      emergencyContact,
      bloodType,
      allergies,
      medicalConditions 
    } = body;

    const { rows } = await sql`
      UPDATE patients 
      SET 
        full_name = ${fullName},
        email = ${email},
        phone = ${phone},
        date_of_birth = ${dateOfBirth},
        address = ${address},
        emergency_contact = ${emergencyContact},
        blood_type = ${bloodType},
        allergies = ${allergies},
        medical_conditions = ${medicalConditions},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${patientId}
      RETURNING *
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}