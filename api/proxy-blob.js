import fs from 'fs';
import path from 'path';

// Fallback for local development
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/BLOB_READ_WRITE_TOKEN=["']?([^"'\s]+)["']?/);
      if (match && match[1]) {
        process.env.BLOB_READ_WRITE_TOKEN = match[1];
      }
    }
  } catch (err) {}
}

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return res.status(500).send('Storage token missing');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Storage error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    
    // Convert to buffer and send
    const blob = await response.arrayBuffer();
    return res.send(Buffer.from(blob));
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).send('Failed to retrieve file from secure storage');
  }
}
