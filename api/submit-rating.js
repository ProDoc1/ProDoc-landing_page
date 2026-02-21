import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { doctorId, userId, userName, ratings, comment } = req.body;

  if (!doctorId || !userId || !ratings) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ensure table exists (fail-safe)
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

    // --- TOXICITY CHECK ALGORITHM (Simple Keyword Match) ---
    // In production, use OpenAI Moderation API or Google Perspective API
    const toxicWords = ['scam', 'fraud', 'fake', 'idiot', 'stupid', 'incompetent', 'useless', 'kill', 'hate', 'racist', 'sexist'];
    const commentLower = (comment || '').toLowerCase().trim();

    let isToxic = false;
    let toxicityScore = 0;

    // Check for toxic words
    if (toxicWords.some(word => commentLower.includes(word))) {
      isToxic = true;
      toxicityScore = 0.9; // High probability
    }

    // Determine Status
    // If Proof is provided + Safe Content -> Approved
    // If Toxic -> Rejected
    // Else -> Pending
    let status = 'approved';

    if (isToxic) {
      status = 'rejected';
    } else if (!req.body.proof) {
      // Should have been caught by frontend but double check
      // If no proof provided (maybe older API call), pending.
      status = 'pending';
    } else {
      // If proof exists and no toxic content, we auto-approve for this demo.
      // In real app, "Safe" reviews might still be 'pending' admin review of the receipt image.
      // User requested: "Only safe reviews are published; others are hold for admin or rejected"
      status = 'approved';
    }

    // Insert into doctor_ratings table
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

    // Return different messages based on status
    if (status === 'rejected') {
      // Silently reject or warn user? Usually better to say "Submitted for review" to avoid confrontation,
      // but transparency might be key here.
      return res.status(200).json({ success: true, status: 'pending', message: 'Review flagged for moderation.' });
    }

    return res.status(200).json({ success: true, status: status, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    // Return the specific DB error message to the client for debugging
    return res.status(500).json({ error: error.message });
  }
}
