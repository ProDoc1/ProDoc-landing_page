import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      ALTER TABLE doctor_ratings ADD COLUMN IF NOT EXISTS comment TEXT;
    `;

    await sql`
      ALTER TABLE doctor_ratings 
      ADD COLUMN IF NOT EXISTS proof_url TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS toxicity_score REAL DEFAULT 0;
    `;

    return res.status(200).json({ message: "Ratings table created successfully" });
  } catch (error) {
    console.error("Error setting up ratings table:", error);
    return res.status(500).json({ error: error.message });
  }
}
