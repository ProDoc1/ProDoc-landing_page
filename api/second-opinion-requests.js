import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS second_opinion_requests (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(255) NOT NULL,
        doctor_id VARCHAR(255) NOT NULL,
        summary TEXT,
        documents TEXT[],
        amount VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE second_opinion_requests ADD COLUMN IF NOT EXISTS patient_name_fallback TEXT;`;
    await sql`ALTER TABLE second_opinion_requests ADD COLUMN IF NOT EXISTS doctor_feedback TEXT;`;
    
    // One-time cleanup of mock data if requested or detected
    // This removes the 'Nethmin Gomes' and other test records that were using ID '1'
    await sql`DELETE FROM second_opinion_requests WHERE patient_id = '1' OR summary LIKE '%Test Summary%';`;
    // One-time migration: Ensure the users table has the private_key field for seamless viewing
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS private_key TEXT;`;
  } catch (e) {
    console.error('Migration error in second_opinion_requests:', e);
  }

  if (req.method === 'POST') {
    const { patientId, doctorId, summary, documents, amount, problemDescription, patientName } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({ error: 'Patient ID and Doctor ID required' });
    }

    try {
      const result = await sql`
        INSERT INTO second_opinion_requests (patient_id, doctor_id, summary, documents, amount, status, problem_description, patient_name_fallback)
        VALUES (${patientId}, ${doctorId}, ${summary || 'General Second Opinion Request'}, ${documents || []}::text[], ${amount || 'Rs. 2500'}, 'Pending', ${problemDescription || ''}, ${patientName || 'Anonymous'})
        RETURNING *;
      `;
      return res.status(201).json({ success: true, request: result.rows[0] });
    } catch (err) {
      console.error('POST /api/second-opinion-requests error:', err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET') {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID required' });
    }

    try {
      const result = await sql`
        SELECT 
          r.id,
          r.patient_id,
          r.status,
          r.summary,
          r.problem_description,
          r.patient_name_fallback,
          r.documents,
          r.amount,
          r.created_at,
          u.full_name as patient_name,
          u.email,
          u.private_key,
          COALESCE(p.gender, u.gender) as gender,
          COALESCE(p.phone, u.phone) as contact,
          p.date_of_birth,
          p.blood_type,
          p.allergies,
          p.chronic_conditions,
          p.address
        FROM second_opinion_requests r
        LEFT JOIN users u ON CAST(r.patient_id AS TEXT) = CAST(u.id AS TEXT)
        LEFT JOIN patients p ON u.email = p.email
        WHERE r.doctor_id = ${doctorId}
        ORDER BY r.created_at DESC;
      `;

      const formattedRequests = result.rows.map(row => {
        let age = 'N/A';
        if (row.date_of_birth) {
          const dob = new Date(row.date_of_birth);
          const ageDifMs = Date.now() - dob.getTime();
          const ageDate = new Date(ageDifMs);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        let medHistory = 'No medical history provided.';
        const allergies = Array.isArray(row.allergies) ? row.allergies.join(', ') : '';
        const conditions = Array.isArray(row.chronic_conditions) ? row.chronic_conditions.join(', ') : '';

        if (allergies || conditions) {
          medHistory = `Allergies: ${allergies || 'None'}\nConditions: ${conditions || 'None'}`;
        }

        return {
          id: row.id,
          patientName: row.patient_name || row.patient_name_fallback || 'Unknown Patient',
          age: age,
          dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : null,
          gender: row.gender || 'Not specified',
          dateRequired: new Date(row.created_at).toISOString().split('T')[0],
          status: row.status,
          summary: row.summary,
          problemDescription: row.problem_description,
          doctorFeedback: row.doctor_feedback,
          documents: row.documents && row.documents.length > 0 ? row.documents : [],
          amount: row.amount,
          contact: row.contact || 'Not provided',
          email: row.email,
          privateKey: row.private_key,
          bloodGroup: row.blood_type || null,
          allergies: Array.isArray(row.allergies) ? row.allergies : [],
          chronicConditions: Array.isArray(row.chronic_conditions) ? row.chronic_conditions : [],
          medicalHistory: medHistory,
          address: row.address || null,
          patientId: row.patient_id
        };
      });

      return res.status(200).json(formattedRequests);
    } catch (err) {
      console.error('GET /api/second-opinion-requests error:', err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PUT') {
    const { id, status, feedback } = req.body;
    if (!id) return res.status(400).json({ error: 'ID required' });

    try {
      if (status && feedback) {
        await sql`UPDATE second_opinion_requests SET status = ${status}, doctor_feedback = ${feedback} WHERE id = ${id}`;
      } else if (status) {
        await sql`UPDATE second_opinion_requests SET status = ${status} WHERE id = ${id}`;
      } else if (feedback) {
        await sql`UPDATE second_opinion_requests SET doctor_feedback = ${feedback} WHERE id = ${id}`;
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
