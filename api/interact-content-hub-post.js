import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { post_id, action } = req.body;

        if (!post_id || !action) {
            return res.status(400).json({ error: 'post_id and action are required.' });
        }

        if (action === 'like') {
            await sql`UPDATE content_hub_posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE post_id = ${post_id}`;
            return res.status(200).json({ success: true, message: 'Post liked' });
        } else if (action === 'unlike') {
            await sql`UPDATE content_hub_posts SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE post_id = ${post_id}`;
            return res.status(200).json({ success: true, message: 'Post unliked' });
        } else if (action === 'share') {
            await sql`UPDATE content_hub_posts SET shares_count = COALESCE(shares_count, 0) + 1 WHERE post_id = ${post_id}`;
            return res.status(200).json({ success: true, message: 'Post shared' });
        } else {
            return res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (error) {
        console.error("Error updating content hub post interaction:", error);
        return res.status(500).json({ error: error.message || "Failed to update interaction." });
    }
}
