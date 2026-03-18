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
                // Delete doctor-specific records
                await sql`DELETE FROM doctor_ratings WHERE doctor_id = ${userId}`;
                await sql`DELETE FROM profile_views WHERE doctor_id = ${userId}`;
                await sql`DELETE FROM doctors WHERE doctor_id = ${userId}`;
            } else {
                // Delete user (patient) records
                await sql`DELETE FROM doctor_ratings WHERE user_id = ${userId}`;
                await sql`DELETE FROM users WHERE id = ${userId}`; 
            }

            return res.status(200).json({ message: `${type || 'User'} deleted successfully` });
        } catch (error) {
            console.error('Error deleting:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
