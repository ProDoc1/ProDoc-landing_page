import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Initialize table and update schema safely
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS doctor_requests (
                id SERIAL PRIMARY KEY,
                full_name TEXT,
                gender TEXT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                slmc_number TEXT NOT NULL,
                specialty TEXT NOT NULL,
                department_type TEXT,
                educational_qualifications TEXT,
                languages TEXT,
                years_of_experience INTEGER,
                image_url TEXT,
                associated_hospitals JSONB DEFAULT '[]',
                bio TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        // Ensure all requisite columns exist and non-essential ones are nullable
        const schemaSync = async () => {
            const cols = [
                ['full_name', 'TEXT'],
                ['gender', 'TEXT'],
                ['department_type', 'TEXT'],
                ['educational_qualifications', 'TEXT'],
                ['image_url', 'TEXT'],
                ['languages', 'TEXT'],
                ['years_of_experience', 'INTEGER'],
                ['associated_hospitals', 'JSONB']
            ];
            for (const [name, type] of cols) {
                try {
                    await sql.query(`ALTER TABLE doctor_requests ADD COLUMN IF NOT EXISTS ${name} ${type}`);
                } catch (e) { /* Silently handle column sync */ }
            }

            try {
                await sql`ALTER TABLE doctor_requests ALTER COLUMN working_hospital DROP NOT NULL`;
            } catch (e) { /* Col might not exist */ }
        };
        await schemaSync();
        
    } catch (err) {
        console.error('Migration failure:', err);
    }

    if (req.method === 'POST') {
        const { 
            firstName, lastName, gender, email, password, slmcNumber, specialty, 
            sector, qualifications, languages, yearsOfExperience, profilePhoto,
            associatedHospitals, bio 
        } = req.body;

        if (!firstName || !lastName || !email || !password || !slmcNumber || !specialty) {
            return res.status(400).json({ error: 'Missing core required fields' });
        }

        // Validate SLMC Number (must be digits, we'll prefix it here)
        if (!/^\d{4,5}$/.test(slmcNumber)) {
            return res.status(400).json({ error: 'SLMC Number must be 4-5 digits' });
        }

        try {
            const existingDoctor = await sql`SELECT 1 FROM doctors WHERE contact_email = ${email}`;
            if (existingDoctor.rows.length > 0) return res.status(400).json({ error: 'A doctor with this email already exists' });

            const existingRequest = await sql`SELECT 1 FROM doctor_requests WHERE email = ${email} AND status = 'pending'`;
            if (existingRequest.rows.length > 0) return res.status(400).json({ error: 'A pending request already exists for this email' });

            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Format Full Name with Dr. prefix
            const formattedFullName = `Dr. ${firstName.trim()} ${lastName.trim()}`;
            
            // Format Specialty: Title Case
            const formattedSpecialty = specialty.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            // Format SLMC Number
            const formattedSLMC = `SLMC-MD-${slmcNumber}`;

            const experience = parseInt(yearsOfExperience) || 0;

            await sql`
                INSERT INTO doctor_requests (
                    full_name, gender, email, password, slmc_number, specialty, 
                    department_type, educational_qualifications, languages, 
                    years_of_experience, image_url, associated_hospitals, bio
                ) VALUES (
                    ${formattedFullName}, ${gender}, ${email}, ${hashedPassword}, ${formattedSLMC}, ${formattedSpecialty}, 
                    ${sector}, ${qualifications}, ${languages}, ${experience}, 
                    ${profilePhoto}, ${JSON.stringify(associatedHospitals)}, ${bio}
                )
            `;

            return res.status(200).json({ success: true, message: 'Request submitted successfully' });
        } catch (error) {
            console.error('Registration request error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'GET') {
        try {
            const { rows } = await sql`SELECT * FROM doctor_requests ORDER BY created_at DESC`;
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        const { id, action } = req.body;
        if (!id || !action) return res.status(400).json({ error: 'Missing id or action' });

        try {
            const { rows } = await sql`SELECT * FROM doctor_requests WHERE id = ${id}`;
            if (rows.length === 0) return res.status(404).json({ error: 'Request not found' });

            const request = rows[0];

            if (action === 'approve') {
                const hospitals = Array.isArray(request.associated_hospitals) 
                    ? request.associated_hospitals 
                    : JSON.parse(request.associated_hospitals || '[]');
                const primaryHospital = hospitals.length > 0 ? hospitals[0] : 'N/A';

                await sql`
                    INSERT INTO doctors (
                        full_name, contact_email, password, slmc_number, specialty, 
                        working_hospital, associated_hospitals, bio, user_type,
                        department_type, educational_qualifications, languages, 
                        years_of_experience, image_url, gender
                    ) VALUES (
                        ${request.full_name}, ${request.email}, ${request.password}, 
                        ${request.slmc_number}, ${request.specialty}, 
                        ${primaryHospital}, ${JSON.stringify(hospitals)}, 
                        ${request.bio}, 'doctor',
                        ${request.department_type}, ${request.educational_qualifications}, 
                        ${request.languages}, ${request.years_of_experience}, ${request.image_url},
                        ${request.gender}
                    )
                `;
                
                await sql`UPDATE doctor_requests SET status = 'approved' WHERE id = ${id}`;
                return res.status(200).json({ success: true, message: 'Doctor profile created' });
            } else if (action === 'reject') {
                await sql`UPDATE doctor_requests SET status = 'rejected' WHERE id = ${id}`;
                return res.status(200).json({ success: true, message: 'Request rejected' });
            }

            return res.status(400).json({ error: 'Invalid action' });
        } catch (error) {
            console.error('Update request error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
