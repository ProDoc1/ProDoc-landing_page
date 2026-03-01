import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
