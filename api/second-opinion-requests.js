import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Ensure table exists
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
  } catch (e) {
    console.error('Error creating second_opinion_requests table:', e);
  }

  if (req.method === 'POST') {
    const { patientId, doctorId, summary, documents, amount } = req.body;
    
    if (!patientId || !doctorId) {
      return res.status(400).json({ error: 'Patient ID and Doctor ID required' });
    }
    
    try {
      const result = await sql`
        INSERT INTO second_opinion_requests (patient_id, doctor_id, summary, documents, amount, status)
        VALUES (${patientId}, ${doctorId}, ${summary || 'General Second Opinion Request'}, ${documents || []}::text[], ${amount || 'Rs. 2500'}, 'Pending')
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
          r.status,
          r.summary,
          r.documents,
          r.amount,
          r.created_at,
          u.full_name as patient_name,
          u.email,
          p.date_of_birth,
          p.gender,
          p.phone as contact,
          p.blood_type,
          p.allergies,
          p.chronic_conditions,
          p.address
        FROM second_opinion_requests r
        JOIN users u ON CAST(r.patient_id AS TEXT) = CAST(u.id AS TEXT)
        LEFT JOIN patients p ON u.email = p.email
        WHERE r.doctor_id = ${doctorId}
        ORDER BY r.created_at DESC;
      `;
      
      const formattedRequests = result.rows.map(row => {
        // Calculate age
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
          patientName: row.patient_name || 'Unknown Patient',
          age: age,
          gender: row.gender || 'Not specified',
          dateRequired: new Date(row.created_at).toISOString().split('T')[0],
          status: row.status,
          summary: row.summary,
          documents: row.documents && row.documents.length > 0 ? row.documents : ['Consultation_Notes.pdf'],
          amount: row.amount,
          contact: row.contact || 'Not provided',
          email: row.email,
          bloodGroup: row.blood_type || 'Unknown',
          medicalHistory: medHistory,
          address: row.address || 'Not provided'
        };
      });
      
      return res.status(200).json(formattedRequests);
    } catch (err) {
      console.error('GET /api/second-opinion-requests error:', err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PUT') {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ error: 'ID and Status required' });
    
    try {
      await sql`UPDATE second_opinion_requests SET status = ${status} WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
