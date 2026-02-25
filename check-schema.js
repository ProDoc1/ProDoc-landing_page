import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

config();

(async () => {
    try {
        const result = await sql`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'users' OR table_name = 'doctors';
        `;
        console.log(result.rows);
    } catch (err) {
        console.error("DB Error:", err);
    }
})();
