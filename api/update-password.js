import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // 1. Only allow POST or PATCH requests
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { id, newPassword } = req.body;

    // 2. Basic Validation
    if (!id || !newPassword) {
        return res.status(400).json({ error: 'Doctor ID and new password are required' });
    }

    try {
        // 3. Update the password in the database
        const result = await sql`
            UPDATE doctors 
            SET password = ${newPassword} 
            WHERE doctor_id = ${id}
            RETURNING doctor_id;
        `;

        // 4. Check if the doctor actually existed
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}