// Vercel Serverless Function — Proxy fal.ai
// FAL_KEY vive en variables de entorno de Vercel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: 'FAL_KEY no configurada en Vercel' });
  }

  const { endpoint, payload } = req.body;
  if (!endpoint || !payload) {
    return res.status(400).json({ error: 'Falta endpoint o payload' });
  }
  if (!endpoint.startsWith('https://fal.run/')) {
    return res.status(412).json({ error: 'Endpoint no permitido' });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Key ' + falKey,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Error fal.ai: ' + e.message });
  }
}
