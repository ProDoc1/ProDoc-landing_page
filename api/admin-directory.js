import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { rows: users } = await sql`
                SELECT id, full_name, email FROM users ORDER BY full_name ASC;
            `;
            const { rows: doctors } = await sql`
                SELECT doctor_id as id, full_name, contact_email as email, specialty, working_hospital FROM doctors ORDER BY full_name ASC;
            `;
            return res.status(200).json({ users, doctors });
        } catch (error) {
            console.error('Error fetching directory:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId, type } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            if (type === 'doctor') {
                try {
                    await sql`DELETE FROM doctor_ratings WHERE doctor_id = ${userId} OR user_id = ${userId}`;
                } catch (e) { console.warn('doctor_ratings delete skip:', e.message); }
                try {
                    await sql`DELETE FROM profile_views WHERE doctor_id = ${userId}`;
                } catch (e) { console.warn('profile_views delete skip:', e.message); }
                try {
                    await sql`DELETE FROM saved_doctors WHERE doctor_id = ${userId}`;
                } catch (e) { console.warn('saved_doctors delete skip:', e.message); }
                try {
                    await sql`DELETE FROM manage_doctor_posts WHERE doctor_id = ${userId}`;
                } catch (e) { console.warn('manage_doctor_posts delete skip:', e.message); }
                try {
                    await sql`DELETE FROM doctors WHERE doctor_id = ${userId}`;
                } catch (e) { console.warn('doctors delete skip:', e.message); }
            } else {
                try {
                    await sql`DELETE FROM doctor_ratings WHERE user_id = ${userId}`;
                } catch (e) { console.warn('doctor_ratings delete skip:', e.message); }
                try {
                    await sql`DELETE FROM medical_records WHERE patient_id = ${userId}`;
                } catch (e) { console.warn('medical_records delete skip:', e.message); }
                try {
                    await sql`DELETE FROM medical_records WHERE patient_email IN (SELECT email FROM users WHERE id = ${userId})`;
                } catch (e) { console.warn('medical_records email delete skip:', e.message); }
                try {
                    await sql`DELETE FROM saved_doctors WHERE patient_id = ${userId}`;
                } catch (e) { console.warn('saved_doctors delete skip:', e.message); }
                try {
                    await sql`DELETE FROM second_opinion_requests WHERE patient_id = ${userId}`;
                } catch (e) { console.warn('second_opinion_requests delete skip:', e.message); }
                try {
                    await sql`DELETE FROM patients WHERE id = ${userId}`;
                } catch (e) { console.warn('patients delete skip:', e.message); }
                try {
                    await sql`DELETE FROM patients WHERE email IN (SELECT email FROM users WHERE id = ${userId})`;
                } catch (e) { console.warn('patients email delete skip:', e.message); }
                try {
                    await sql`DELETE FROM users WHERE id = ${userId}`; 
                } catch (e) { console.warn('users delete skip:', e.message); }
            }

            return res.status(200).json({ message: `${type || 'User'} deleted successfully` });
        } catch (error) {
            console.error('Error deleting:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
