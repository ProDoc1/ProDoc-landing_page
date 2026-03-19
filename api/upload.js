import { put } from '@vercel/blob';
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

export const config = {
  api: {
    // Re-enabling body parser. Vercel converts application/octet-stream into a Buffer
    // automatically, which is more reliable in local dev environments.
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = request.query;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return response.status(500).json({ error: 'Server configuration error: Token missing' });
    }

    if (!filename) {
      return response.status(400).json({ error: 'Missing filename parameter' });
    }

    // With bodyParser enabled, if the content-type is octet-stream, 
    // request.body will be a Buffer.
    let fileBuffer = request.body;

    // If for some reason it's not a buffer (e.g. empty or weird encoding), try reading the stream
    if (!fileBuffer || (Buffer.isBuffer(fileBuffer) && fileBuffer.length === 0)) {
       // Fallback to manual stream reading just in case
       const chunks = [];
       for await (const chunk of request) {
         chunks.push(chunk);
       }
       fileBuffer = Buffer.concat(chunks);
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return response.status(400).json({ error: 'Empty file body - no data received' });
    }

    const blob = await put(`medical-records/${filename}`, fileBuffer, {
      access: 'private',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'application/octet-stream'
    });

    return response.status(200).json(blob);
  } catch (error) {
    console.error('Upload error details:', error);
    return response.status(500).json({ 
      error: 'Upload failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}