import { sql } from '@vercel/postgres';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const form = formidable({ multiples: true });
    let fields, files;
    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        return res.status(400).json({ error: 'Failed to parse upload' });
    }

    const doctorId = fields.doctorId?.[0];
    if (!doctorId) return res.status(401).json({ error: 'Unauthorized: missing doctorId' });

    try {
        const { rows } = await sql`SELECT doctor_id FROM doctors WHERE doctor_id = ${doctorId}`;
        if (rows.length === 0) return res.status(403).json({ error: 'Access denied: not a registered doctor' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    const imageFile = files.medical_image?.[0];
    if (!imageFile) return res.status(400).json({ error: 'No medical_image file provided' });

    const rawUrl = process.env.AI_BACKEND_URL;
    const internalKey = process.env.INTERNAL_API_KEY;

    // Fallback to Gemini if backend not configured
    if (!rawUrl || !internalKey) {
        return handleWithGemini(req, res, imageFile, files);
    }

    const normalizedUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const backendUrl = normalizedUrl.replace(/\/+$/, '');
    const analyzeUrl = `${backendUrl}/analyze`;

    console.log('[ai-analyze] Calling backend:', analyzeUrl);

    try {
        const imageBuffer = fs.readFileSync(imageFile.filepath);
        const imageBlob = new Blob([imageBuffer], { type: imageFile.mimetype || 'image/jpeg' });

        const fd = new FormData();
        fd.append('medical_image', imageBlob, imageFile.originalFilename || 'image');

        const reportFile = files.report_file?.[0];
        if (reportFile) {
            const reportBuffer = fs.readFileSync(reportFile.filepath);
            const reportBlob = new Blob([reportBuffer], { type: reportFile.mimetype || 'application/octet-stream' });
            fd.append('report_file', reportBlob, reportFile.originalFilename || 'report');
        }

        const aiRes = await fetch(analyzeUrl, {
            method: 'POST',
            headers: { 'x-internal-key': internalKey },
            body: fd,
            signal: AbortSignal.timeout(120000),
        });

        const result = await aiRes.json();
        console.log('[ai-analyze] Backend status:', aiRes.status);

        if (!aiRes.ok) {
            console.error('[ai-analyze] Backend error:', result);
            return res.status(aiRes.status).json(result);
        }

        // Wrap backend result so the UI can render it
        return res.status(200).json({ ...result, _source: 'backend' });
    } catch (err) {
        console.error('[ai-analyze] Backend unreachable:', err.message, '— falling back to Gemini');
        return handleWithGemini(req, res, imageFile, files);
    }
}

async function handleWithGemini(req, res, imageFile, files) {
    const { GoogleGenAI } = await import('@google/genai');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'No AI backend configured' });

    try {
        const imageBuffer = fs.readFileSync(imageFile.filepath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = imageFile.mimetype || 'image/jpeg';

        const ai = new GoogleGenAI({ apiKey });

        let prompt = `You are a medical AI assistant helping a licensed doctor analyze a medical image.

Provide a structured analysis with these sections:

**Image Description**
What type of medical image this is and key visual features.

**Key Findings**
Notable observations, abnormalities, or significant features.

**Risk Assessment**
Classify as Low / Moderate / High risk with explanation.

**Differential Diagnoses**
Possible conditions to consider based on what is visible.

**Recommended Next Steps**
Suggested follow-up tests or clinical actions.

---
For licensed medical professionals only. Does not replace clinical judgment.`;

        const reportFile = files.report_file?.[0];
        if (reportFile) {
            try {
                const reportText = fs.readFileSync(reportFile.filepath, 'utf8');
                prompt += `\n\n**Additional context from attached report:**\n${reportText.substring(0, 3000)}`;
            } catch {}
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ parts: [{ inlineData: { data: base64Image, mimeType } }, { text: prompt }] }]
        });

        console.log('[ai-analyze] Gemini fallback used');
        return res.status(200).json({ analysis: response.text, status: 'success', _source: 'gemini' });
    } catch (err) {
        console.error('[ai-analyze] Gemini error:', err.message);
        return res.status(502).json({ error: 'AI analysis failed: ' + err.message });
    }
}
