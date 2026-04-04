import fs from 'fs';
import path from 'path';

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
  const { url, type } = req.query;
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
    const contentLength = response.headers.get('content-length');
    
    res.setHeader('Content-Type', type || contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'inline');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    
    const reader = response.body.getReader();
    
    while(true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
    }
    
    res.end();
  } catch (error) {
    console.error('Proxy error:', error);
    if (!res.headersSent) {
        return res.status(500).send('Failed to retrieve file from secure storage');
    }
    res.end();
  }
}
