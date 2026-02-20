import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Admin auth check would go here

    const { reviewId, action } = req.body;

    if (!reviewId || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    try {
        await sql`
      UPDATE doctor_ratings 
      SET status = ${newStatus}
      WHERE id = ${reviewId};
    `;

        return res.status(200).json({ success: true, status: newStatus });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ error: "Update failed" });
    }
}
