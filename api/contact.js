export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get Formspree URL from environment variables, or fallback to the provided endpoint
  const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/xvznqvrz';

  try {
    const response = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Serverless Contact Form Error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
