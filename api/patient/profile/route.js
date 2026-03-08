// import { sql } from '@vercel/postgres';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const patientId = searchParams.get('patientId');
//   const email = searchParams.get('email');

//   if (!patientId && !email) {
//     return NextResponse.json({ error: 'Patient ID or Email is required' }, { status: 400 });
//   }

//   try {
//     let query;
//     if (patientId && patientId !== '1') {
//       query = sql`SELECT * FROM users WHERE id = ${patientId}`;
//     } else if (email) {
//       query = sql`SELECT * FROM users WHERE email = ${email}`;
//     } else {
//       // Fallback if ID is '1' and no email provided - unlikely if called correctly
//       return NextResponse.json({ error: 'Valid Patient ID or Email is required' }, { status: 400 });
//     }

//     const { rows } = await query;

//     if (rows.length === 0) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const user = rows[0];

//     // Transform DB columns to frontend camelCase
//     const userData = {
//       id: user.id,
//       fullName: user.full_name,
//       email: user.email,
//       phone: user.phone,
//       dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
//       address: user.address,
//       emergencyContact: user.emergency_contact,
//       bloodType: user.blood_type,
//       allergies: user.allergies,
//       medicalConditions: user.medical_conditions,
//     };

//     return NextResponse.json(userData);
//   } catch (error) {
//     console.error('Fetch Profile Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function PUT(request) {
//   try {
//     const body = await request.json();
//     const {
//       patientId,
//       fullName,
//       email,
//       phone,
//       dateOfBirth,
//       address,
//       emergencyContact,
//       bloodType,
//       allergies,
//       medicalConditions
//     } = body;

//     const { rows } = await sql`
//       UPDATE patients 
//       SET 
//         full_name = ${fullName},
//         email = ${email},
//         phone = ${phone},
//         date_of_birth = ${dateOfBirth},
//         address = ${address},
//         emergency_contact = ${emergencyContact},
//         blood_type = ${bloodType},
//         allergies = ${allergies},
//         medical_conditions = ${medicalConditions},
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = ${patientId}
//       RETURNING *
//     `;

//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
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