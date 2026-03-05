import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Handle CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        const { id } = req.query;

        if (id) {
            // Get single doctor profile
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
            // Get all doctors
            try {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');

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
        const { id, name, specialty, slmcNumber, image_url, bio } = req.body || {};

        if (!id) return res.status(400).json({ error: 'Doctor ID is required' });

        try {
            const existsRes = await sql`SELECT doctor_id FROM doctors WHERE doctor_id = ${id}`;
            const exists = existsRes?.rows || existsRes;
            if (!exists || exists.length === 0) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            const body = req.body || {};
            const fields = {
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

            async function columnExists(colName) {
                try {
                    const colRes = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = ${colName}`;
                    const rows = colRes?.rows || colRes;
                    return rows && rows.length > 0;
                } catch (err) {
                    console.warn('Could not verify column existence for', colName, err?.message || err);
                    return true;
                }
            }

            if (fields.full_name !== undefined && await columnExists('full_name')) {
                await sql`UPDATE doctors SET full_name = ${fields.full_name} WHERE doctor_id = ${id}`;
            }
            if (fields.slmc_number !== undefined && await columnExists('slmc_number')) {
                await sql`UPDATE doctors SET slmc_number = ${fields.slmc_number} WHERE doctor_id = ${id}`;
            }
            if (fields.specialty !== undefined && await columnExists('specialty')) {
                await sql`UPDATE doctors SET specialty = ${fields.specialty} WHERE doctor_id = ${id}`;
            }
            if (fields.gender !== undefined && await columnExists('gender')) {
                await sql`UPDATE doctors SET gender = ${fields.gender} WHERE doctor_id = ${id}`;
            }
            if (fields.department_type !== undefined && await columnExists('department_type')) {
                await sql`UPDATE doctors SET department_type = ${fields.department_type} WHERE doctor_id = ${id}`;
            }
            if (fields.working_hospital !== undefined && await columnExists('working_hospital')) {
                await sql`UPDATE doctors SET working_hospital = ${fields.working_hospital} WHERE doctor_id = ${id}`;
            }
            if (fields.contact_email !== undefined && await columnExists('contact_email')) {
                await sql`UPDATE doctors SET contact_email = ${fields.contact_email} WHERE doctor_id = ${id}`;
            }
            if (fields.years_of_experience !== undefined && await columnExists('years_of_experience')) {
                await sql`UPDATE doctors SET years_of_experience = ${fields.years_of_experience} WHERE doctor_id = ${id}`;
            }
            if (fields.password !== undefined && await columnExists('password')) {
                await sql`UPDATE doctors SET password = ${fields.password} WHERE doctor_id = ${id}`;
            }
            if (fields.user_type !== undefined && await columnExists('user_type')) {
                await sql`UPDATE doctors SET user_type = ${fields.user_type} WHERE doctor_id = ${id}`;
            }
            if (fields.image_url !== undefined && await columnExists('image_url')) {
                await sql`UPDATE doctors SET image_url = ${fields.image_url} WHERE doctor_id = ${id}`;
            }
            if (fields.associated_hospitals !== undefined && await columnExists('associated_hospitals')) {
                await sql`UPDATE doctors SET associated_hospitals = ${fields.associated_hospitals} WHERE doctor_id = ${id}`;
            }
            if (fields.bio !== undefined && await columnExists('bio')) {
                await sql`UPDATE doctors SET bio = ${fields.bio} WHERE doctor_id = ${id}`;
            }
            if (fields.languages !== undefined && await columnExists('languages')) {
                await sql`UPDATE doctors SET languages = ${fields.languages} WHERE doctor_id = ${id}`;
            }
            if (fields.educational_qualifications !== undefined && await columnExists('educational_qualifications')) {
                await sql`UPDATE doctors SET educational_qualifications = ${fields.educational_qualifications} WHERE doctor_id = ${id}`;
            }
            if (fields.second_opinion_available !== undefined && await columnExists('second_opinion_available')) {
                await sql`UPDATE doctors SET second_opinion_available = ${fields.second_opinion_available} WHERE doctor_id = ${id}`;
            }
            if (fields.second_opinion_dates !== undefined && await columnExists('second_opinion_dates')) {
                await sql`UPDATE doctors SET second_opinion_dates = ${fields.second_opinion_dates} WHERE doctor_id = ${id}`;
            }

            const updatedRes = await sql`
        SELECT doctor_id as id, full_name as name, contact_email as email, specialty, slmc_number as "slmcNumber", image_url, bio, working_hospital as location, languages, email_verified, associated_hospitals
        FROM doctors WHERE doctor_id = ${id}
      `;
            const updated = updatedRes?.rows ? updatedRes.rows[0] : updatedRes[0];

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
            if (process.env.NODE_ENV !== 'production') {
                return res.status(500).json({ error: error.message, stack: error.stack });
            }
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
