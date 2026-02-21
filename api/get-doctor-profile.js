import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    try {
        const { rows } = await sql`
      SELECT 
        doctor_id as id, 
        full_name, 
        contact_email as email, 
        specialty, 
        slmc_number, 
        image_url, 
        department_type, 
        associated_hospitals,
        years_of_experience,
        bio,
        second_opinion_available,
        second_opinion_dates,
        languages,
        languages,
        educational_qualifications,
        (SELECT COALESCE(AVG(overall), 0) FROM doctor_ratings WHERE doctor_ratings.doctor_id = doctors.doctor_id::varchar AND (status = 'approved' OR status IS NULL)) as average_rating,
        (SELECT COUNT(*) FROM doctor_ratings WHERE doctor_ratings.doctor_id = doctors.doctor_id::varchar AND (status = 'approved' OR status IS NULL)) as rating_count
      FROM doctors 
      WHERE doctor_id = ${id};
    `;

        if (rows.length > 0) {
            // Ensure associated_hospitals is parsed if it's stored as a string
            const doctorData = rows[0];
            if (typeof doctorData.associated_hospitals === 'string') {
                try {
                    doctorData.associated_hospitals = JSON.parse(doctorData.associated_hospitals);
                } catch (e) {
                    doctorData.associated_hospitals = [];
                }
            }
            return res.status(200).json(doctorData);
        } else {
            return res.status(404).json({ error: 'Doctor not found' });
        }
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
