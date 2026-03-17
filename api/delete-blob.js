import { del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Fallback for local development if vercel dev fails to load .env.local
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/BLOB_READ_WRITE_TOKEN=["']?([^"'\s]+)["']?/);
      if (match && match[1]) {
        process.env.BLOB_READ_WRITE_TOKEN = match[1];
        console.log('Manually loaded BLOB_READ_WRITE_TOKEN from .env.local');
      }
    }
  } catch (err) {
    console.error('Failed to manually load .env.local:', err);
  }
}

export default async function handler(request, response) {
  if (request.method !== 'DELETE') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = request.query;

    if (!url) {
      return response.status(400).json({ error: 'Missing url parameter' });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return response.status(500).json({ error: 'Server configuration error: Token missing' });
    }

    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return response.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error details:', error);
    return response.status(500).json({ 
      error: 'Delete failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}
