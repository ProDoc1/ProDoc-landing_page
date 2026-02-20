// api/get-content-hub-posts.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Disable caching to ensure fresh data
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Fetch posts from content_hub_posts table
        const { rows } = await sql`
      SELECT * FROM content_hub_posts 
      ORDER BY created_at DESC
    `;

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching content hub posts:", error);
        return res.status(500).json({ error: "Failed to fetch content hub posts" });
    }
}
