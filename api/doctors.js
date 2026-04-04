import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        const { id } = req.query;

        if (id) {
            try {
                const { rows } = await sql`
          SELECT 
            doctor_id as id, 
            full_name as name, 
            contact_email as email, 
            specialty, 
            slmc_number as "slmcNumber", 
            image_url, 
            department_type, 
            associated_hospitals,
            years_of_experience,
            bio,
            second_opinion_available,
            second_opinion_dates,
            working_hospital as location,
            languages,
            educational_qualifications,
            email_verified,
            (SELECT COALESCE(AVG(overall), 0) FROM doctor_ratings WHERE doctor_ratings.doctor_id = doctors.doctor_id::varchar AND (status = 'approved' OR status = 'pending' OR status IS NULL)) as average_rating,
            (SELECT COUNT(*) FROM doctor_ratings WHERE doctor_ratings.doctor_id = doctors.doctor_id::varchar AND (status = 'approved' OR status = 'pending' OR status IS NULL)) as rating_count
          FROM doctors 
          WHERE doctor_id = ${id};
        `;

                if (rows.length > 0) {
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
        } else {
            try {
                // Enable some caching for the doctor list to speed up repeat visits
                res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

                const { rows } = await sql`
          SELECT 
            d.*,
            COALESCE(r.avg_rating, 0) as average_rating,
            COALESCE(r.count, 0) as rating_count
          FROM doctors d
          LEFT JOIN (
            SELECT 
              doctor_id, 
              AVG(overall) as avg_rating, 
              COUNT(id) as count 
            FROM doctor_ratings 
            WHERE status = 'approved' OR status = 'pending' OR status IS NULL
            GROUP BY doctor_id
          ) r ON d.doctor_id::text = r.doctor_id::text
          ORDER BY d.full_name ASC;
        `;

                return res.status(200).json(rows);
            } catch (error) {
                console.error("Database Error:", error);
                return res.status(500).json({ error: "Failed to fetch doctors" });
            }
        }
    }

    if (req.method === 'PUT' || req.method === 'POST') {
        const { id } = req.body || {};

        if (!id) return res.status(400).json({ error: 'Doctor ID is required' });

        try {
            const body = req.body || {};
            
            // Map incoming fields to database columns
            const fieldMap = {
                full_name: body.name ?? body.full_name ?? body.fullName,
                slmc_number: body.slmcNumber ?? body.slmc_number,
                specialty: body.specialty,
                gender: body.gender,
                department_type: body.departmentType ?? body.department_type,
                working_hospital: body.workingHospital ?? body.working_hospital ?? body['working hospital'] ?? body.location,
                contact_email: body.contactEmail ?? body.contact_email,
                years_of_experience: body.yearsOfExperience ?? body.years_of_experience ?? body.years_of_experince,
                password: body.password,
                user_type: body.userType ?? body.user_type,
                image_url: body.image_url ?? body.image_URL ?? body.imageURL,
                associated_hospitals: body.associated_hospitals ?? body.associated_hospital ?? body.assoiated_hospital ?? body.associatedHospital,
                bio: body.bio,
                languages: body.languages,
                educational_qualifications: body.educational_qualifications ?? body.educationalQualifications ?? body.qualifications,
                second_opinion_available: body.secondOpinionAvailable ?? body.second_opinion_available,
                second_opinion_dates: body.secondOpinionDates ?? body.second_opinion_dates,
            };

            // Build a single dynamic update query for performance
            const updates = [];
            const values = [];
            let i = 1;

            for (const [key, value] of Object.entries(fieldMap)) {
                if (value !== undefined) {
                    updates.push(`${key} = $${i}`);
                    values.push(value);
                    i++;
                }
            }

            if (updates.length > 0) {
                // Add the ID as the last parameter
                values.push(id);
                const query = `UPDATE doctors SET ${updates.join(', ')} WHERE doctor_id = $${i}`;
                
                // Using the raw client to execute a dynamic query string with parameters
                // Note: @vercel/postgres sql template tag doesn't easily support dynamic SET clauses
                // so we use a prepared statement approach
                await sql.query(query, values);
            }

            const updatedRes = await sql`
                SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url, bio, working_hospital as location, languages, email_verified, associated_hospitals
                FROM doctors WHERE doctor_id = ${id}
            `;
            const updated = updatedRes.rows[0];

            if (updated && typeof updated.associated_hospitals === 'string') {
                try {
                    updated.associated_hospitals = JSON.parse(updated.associated_hospitals);
                } catch (e) {
                    updated.associated_hospitals = [];
                }
            }

            return res.status(200).json({ success: true, doctor: updated });
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
