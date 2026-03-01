import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { doctorId, userId } = req.query;

        try {
            if (userId) {
                const { rows } = await sql`
                    SELECT 
                        r.id,
                        r.overall as rating,
                        r.comment as text,
                        r.communication,
                        r.punctuality,
                        r.treatment_plan,
                        r.status,
                        r.proof_url,
                        r.created_at,
                        TO_CHAR(r.created_at, 'YYYY-MM-DD') as visitdate,
                        TO_CHAR(r.created_at, 'YYYY-MM-DD') as createdat,
                        d.full_name as doctor_name,
                        d.specialty
                    FROM doctor_ratings r
                    JOIN doctors d ON r.doctor_id::text = d.doctor_id::text
                    WHERE r.user_id = ${userId}
                    ORDER BY r.created_at DESC;
                `;
                return res.status(200).json(rows);
            } else if (doctorId) {
                // Get approved reviews for a specific doctor (include per-category scores)
                const { rows } = await sql`
                    SELECT 
                        id,
                        user_name,
                        communication,
                        punctuality,
                        treatment_plan,
                        overall,
                        comment,
                        proof_url,
                        created_at
                    FROM doctor_ratings
                    WHERE doctor_id = ${doctorId} AND status = 'approved'
                    ORDER BY created_at DESC;
                `;
                return res.status(200).json(rows);
            } else {
                // get all reviews for admin
                const { rows } = await sql`
                    SELECT 
                        r.*,
                        d.full_name as doctor_name,
                        d.image_url as doctor_image
                    FROM doctor_ratings r
                    JOIN doctors d ON r.doctor_id::text = d.doctor_id::text
                    WHERE (r.comment IS NOT NULL AND r.comment != '')
                    ORDER BY r.created_at DESC;
                `;
                return res.status(200).json(rows);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return res.status(500).json({ error: "Failed to fetch reviews" });
        }
    }

    if (req.method === 'POST') {
        // submit-rating
        const { doctorId, userId, userName, ratings, comment, proof } = req.body;

        if (!doctorId || !userId || !ratings) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Proof is required ONLY if a written review (comment) is provided
        if (comment && comment.trim().length > 0 && !proof) {
            return res.status(400).json({ error: 'Proof of visit is required to submit a written review.' });
        }

        try {
            await sql`
        CREATE TABLE IF NOT EXISTS doctor_ratings (
          id SERIAL PRIMARY KEY,
          doctor_id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          user_name VARCHAR(255),
          communication INTEGER CHECK (communication >= 1 AND communication <= 5),
          punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
          treatment_plan INTEGER CHECK (treatment_plan >= 1 AND treatment_plan <= 5),
          professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
          overall INTEGER CHECK (overall >= 1 AND overall <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

            const toxicWords = ['scam', 'fraud', 'fake', 'idiot', 'stupid', 'incompetent', 'useless', 'kill', 'hate', 'racist', 'sexist'];
            const commentLower = (comment || '').toLowerCase().trim();

            let isToxic = false;
            let toxicityScore = 0;

            if (commentLower && toxicWords.some(word => commentLower.includes(word))) {
                isToxic = true;
                toxicityScore = 0.9;
            }

            // Status logic:
            // 1. Toxic -> Rejected
            // 2. Has Comment -> Pending (requires admin verification of text)
            // 3. No Comment -> Approved (stars only)
            let status = 'approved';
            if (isToxic) {
                status = 'rejected';
            } else if (comment && comment.trim().length > 0) {
                status = 'pending';
            } else {
                status = 'approved';
            }



            await sql`
        INSERT INTO doctor_ratings (
          doctor_id,
          user_id,
          user_name,
          communication,
          punctuality,
          treatment_plan,
          professionalism,
          overall,
          comment,
          proof_url,
          status,
          toxicity_score,
          created_at
        ) VALUES (
          ${doctorId},
          ${userId},
          ${userName},
          ${ratings.communication},
          ${ratings.punctuality},
          ${ratings.treatmentPlan},
          ${ratings.professionalism},
          ${ratings.overall},
          ${comment},
          ${req.body.proof}, 
          ${status},
          ${toxicityScore},
          NOW()
        );
      `;

            if (status === 'rejected') {
                return res.status(200).json({ success: true, status: 'pending', message: 'Review flagged for moderation.' });
            }

            return res.status(200).json({ success: true, status: status, message: 'Rating submitted successfully' });
        } catch (error) {
            console.error('Error submitting rating:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        // moderate-review
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

    if (req.method === 'DELETE') {
        const { reviewId } = req.body;
        if (!reviewId) {
            return res.status(400).json({ error: 'Missing reviewId' });
        }
        try {
            await sql`
        DELETE FROM doctor_ratings WHERE id = ${reviewId};
      `;
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting review:', error);
            return res.status(500).json({ error: 'Deletion failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
