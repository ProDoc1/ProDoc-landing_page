import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password } = req.body;

    try {
        // Query matching the provided instructions but adapting to likely existing column names
        // Aliasing matching the user's requested JSON structure
        const { rows } = await sql`
      SELECT doctor_id as id, full_name as name, contact_email as email, specialty 
      FROM doctors 
      WHERE contact_email = ${email} AND password = ${password};
    `;

        if (rows.length > 0) {
            // Login successful
            return res.status(200).json({
                success: true,
                user: rows[0],
                role: 'doctor'
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}