const { Pool } = require('pg');

// Initialize Neon database connection using the URL from your .env.local file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // ----------------------------------------
  // GET: Fetch Patient Profile
  // ----------------------------------------
  if (req.method === 'GET') {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    try {
      const result = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }

      // Format the database snake_case columns back to camelCase for your React frontend
      const dbPatient = result.rows[0];
      const formattedPatient = {
        id: dbPatient.id,
        fullName: dbPatient.full_name,
        email: dbPatient.email,
        phone: dbPatient.phone || '',
        dateOfBirth: dbPatient.date_of_birth ? new Date(dbPatient.date_of_birth).toISOString().split('T')[0] : '',
        gender: dbPatient.gender || '',
        address: dbPatient.address || '',
        emergencyContact: dbPatient.emergency_contact || '',
        bloodType: dbPatient.blood_type || '',
        allergies: dbPatient.allergies || [],
        chronicConditions: dbPatient.chronic_conditions || []
      };

      return res.status(200).json(formattedPatient);

    } catch (error) {
      console.error("Database fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
  }

  // ----------------------------------------
  // PUT: Update Patient Profile
  // ----------------------------------------
  else if (req.method === 'PUT') {
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
      chronicConditions,
      age
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required for updating" });
    }

    try {
      const updateQuery = `
        UPDATE patients 
        SET 
          full_name = $1,
          email = $2,
          phone = $3,
          date_of_birth = $4,
          gender = $5,
          address = $6,
          emergency_contact = $7,
          blood_type = $8,
          allergies = $9,
          chronic_conditions = $10,
          age = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *;
      `;

      const values = [
        fullName,
        email,
        phone,
        dateOfBirth || null, 
        gender,
        address,
        emergencyContact,
        bloodType,
        allergies, 
        chronicConditions,
        age,
        patientId
      ];

      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }

      return res.status(200).json({ 
        message: "Profile updated successfully", 
        patient: result.rows[0] 
      });

    } catch (error) {
      console.error("Database update error:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }
  }

  // ----------------------------------------
  // Handle Unsupported Methods
  // ----------------------------------------
  else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}