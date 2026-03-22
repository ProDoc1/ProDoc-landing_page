import { sql } from '@vercel/postgres';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

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

    if (req.method === 'POST') {
        const { action } = req.body;

        if (action === 'like' || action === 'unlike' || action === 'share') {
            try {
                const { post_id } = req.body;
                if (!post_id) return res.status(400).json({ error: 'post_id is required.' });

                if (action === 'like') {
                    await sql`UPDATE content_hub_posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE post_id = ${post_id}`;
                    return res.status(200).json({ success: true, message: 'Post liked' });
                } else if (action === 'unlike') {
                    await sql`UPDATE content_hub_posts SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE post_id = ${post_id}`;
                    return res.status(200).json({ success: true, message: 'Post unliked' });
                } else if (action === 'share') {
                    await sql`UPDATE content_hub_posts SET shares_count = COALESCE(shares_count, 0) + 1 WHERE post_id = ${post_id}`;
                    return res.status(200).json({ success: true, message: 'Post shared' });
                }
            } catch (error) {
                console.error("Error updating interaction:", error);
                return res.status(500).json({ error: "Failed to update interaction." });
            }
        }

        if (!action || action === 'create') {
            try {
                const { doctor_id, full_name, specialty, image_url, post_content, post_image } = req.body;

                if (!post_content || !post_image || !doctor_id) {
                    return res.status(400).json({ error: 'Content, image, and doctor_id are required to create an article.' });
                }

                await sql`
                    INSERT INTO content_hub_posts (
                        doctor_id,
                        full_name, 
                        specialty, 
                        image_url, 
                        post_content, 
                        post_image
                    ) VALUES (
                        ${doctor_id},
                        ${full_name},
                        ${specialty},
                        ${image_url},
                        ${post_content},
                        ${post_image}
                    )
                `;

                return res.status(200).json({ success: true, message: 'Article created successfully!' });
            } catch (error) {
                console.error("Error creating content hub post:", error);
                return res.status(500).json({ error: error.message || "Failed to create article." });
            }
        }

        return res.status(400).json({ error: 'Invalid POST action.' });
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