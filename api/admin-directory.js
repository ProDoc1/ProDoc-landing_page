import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { rows: users } = await sql`
                SELECT id, full_name, email FROM users ORDER BY full_name ASC;
            `;
            return res.status(200).json({ users });
        } catch (error) {
            console.error('Error fetching directory:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // Start by deleting dependent records if any 
            // For simple implementation, we handle doctor_ratings manually
            await sql`DELETE FROM doctor_ratings WHERE user_id = ${userId}`;
            await sql`DELETE FROM users WHERE id = ${userId}`; 

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
