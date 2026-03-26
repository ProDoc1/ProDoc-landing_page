import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("save-card handler hit! Method:", req.method, "Body:", req.body);
  const idValue = req.body.userId || req.body.id;
  const { cardNumber, expiryDate, cardName, cardType } = req.body;

  if (!idValue || !cardNumber || !expiryDate || !cardName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sql`
            CREATE TABLE IF NOT EXISTS card_details (
                id VARCHAR(255) NOT NULL,
                card_number VARCHAR(255) NOT NULL,
                expiry_date VARCHAR(50) NOT NULL,
                card_name VARCHAR(255) NOT NULL,
                card_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

    await sql`
            INSERT INTO card_details (id, card_number, expiry_date, card_name, card_type)
            VALUES (${idValue}, ${cardNumber}, ${expiryDate}, ${cardName}, ${cardType})
        `;

    return res.status(200).json({ success: true, message: 'Card details saved successfully' });
  } catch (error) {
    console.error('Error saving card details:', error);
    try {
      require('fs').writeFileSync('card-error.log', String(error) + '\nBody: ' + JSON.stringify(req.body));
    } catch (e) { }
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
