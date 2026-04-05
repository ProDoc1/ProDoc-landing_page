import { sql } from '@vercel/postgres';

async function updateNames() {
  try {
    console.log("Starting database name fix...");
    
    // Select all reviews where the user_name is the placeholder 'Verified User'
    // or where we just want to sync it to be safe.
    const result = await sql`
      UPDATE doctor_ratings
      SET user_name = users.full_name
      FROM users
      WHERE doctor_ratings.user_id = users.id
      AND (doctor_ratings.user_name = 'Verified User' OR doctor_ratings.user_name IS NULL OR doctor_ratings.user_name = '')
    `;
    
    console.log(`Successfully updated ${result.rowCount} reviews with actual account names.`);
    
    // Also handling reviews where user_id might be numeric but users table has UUID or vice versa
    // cast to text for max compatibility during comparison
    const result2 = await sql`
      UPDATE doctor_ratings
      SET user_name = users.full_name
      FROM users
      WHERE doctor_ratings.user_id::text = users.id::text
      AND (doctor_ratings.user_name = 'Verified User' OR doctor_ratings.user_name IS NULL OR doctor_ratings.user_name = '')
    `;
    console.log(`Additional check: Updated ${result2.rowCount} reviews using string matching.`);

  } catch (error) {
    console.error("Critical error updating database:", error);
  }
}

updateNames();
