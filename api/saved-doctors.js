import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        try {
            await sql`
                CREATE TABLE IF NOT EXISTS saved_doctors (
                    id SERIAL PRIMARY KEY,
                    patient_id VARCHAR(255) NOT NULL,
                    doctor_id VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(patient_id, doctor_id)
                );
            `;

            const { rows } = await sql`
                SELECT 
                    d.doctor_id as id, 
                    d.full_name as name, 
                    d.specialty, 
                    d.image_url, 
                    d.department_type, 
                    d.years_of_experience,
                    COALESCE((SELECT AVG(overall) FROM doctor_ratings WHERE doctor_ratings.doctor_id = d.doctor_id::varchar AND status = 'approved'), 0) as average_rating,
                    (SELECT COUNT(*) FROM doctor_ratings WHERE doctor_ratings.doctor_id = d.doctor_id::varchar AND status = 'approved') as rating_count
                FROM saved_doctors sd
                JOIN doctors d ON sd.doctor_id = d.doctor_id::varchar
                WHERE sd.patient_id = ${patientId}
                ORDER BY sd.created_at DESC;
            `;

            return res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching saved doctors:", error);
            return res.status(500).json({ error: "Failed to fetch saved doctors" });
        }
    }

    if (req.method === 'POST') {
        const { patientId, doctorId, action } = req.body;

        if (!patientId || !doctorId || !action) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        try {
            await sql`
                CREATE TABLE IF NOT EXISTS saved_doctors (
                    id SERIAL PRIMARY KEY,
                    patient_id VARCHAR(255) NOT NULL,
                    doctor_id VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(patient_id, doctor_id)
                );
            `;

            if (action === 'save') {
                await sql`
                    INSERT INTO saved_doctors (patient_id, doctor_id)
                    VALUES (${patientId}, ${doctorId})
                    ON CONFLICT(patient_id, doctor_id) DO NOTHING;
                `;
                return res.status(200).json({ success: true, message: 'Doctor saved successfully', isSaved: true });
            } else if (action === 'unsave') {
                await sql`
                    DELETE FROM saved_doctors
                    WHERE patient_id = ${patientId} AND doctor_id = ${doctorId};
                `;
                return res.status(200).json({ success: true, message: 'Doctor removed from saved', isSaved: false });
            } else if (action === 'check') {
                const { rows } = await sql`
                    SELECT 1 FROM saved_doctors
                    WHERE patient_id = ${patientId} AND doctor_id = ${doctorId}
                `;
                return res.status(200).json({ isSaved: rows.length > 0 });
            }

            return res.status(400).json({ error: 'Invalid action parameter' });

        } catch (error) {
            console.error("Error updating saved doctor status:", error);
            return res.status(500).json({ error: "Database transaction failed" });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
