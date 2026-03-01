import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { doctor_id } = req.query;
            if (!doctor_id) return res.status(400).json({ error: 'doctor_id is required' });

            const { rows } = await sql`
                SELECT * FROM content_hub_posts
                WHERE doctor_id = ${doctor_id}
                ORDER BY created_at DESC
            `;
            return res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching doctor posts:", error);
            return res.status(500).json({ error: "Failed to fetch posts" });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { post_id, doctor_id } = req.body;
            if (!post_id || !doctor_id) return res.status(400).json({ error: 'post_id and doctor_id are required' });

            await sql`
                DELETE FROM content_hub_posts
                WHERE post_id = ${post_id} AND doctor_id = ${doctor_id}
            `;
            return res.status(200).json({ success: true, message: 'Article deleted successfully' });
        } catch (error) {
            console.error("Error deleting post:", error);
            return res.status(500).json({ error: "Failed to delete article" });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
