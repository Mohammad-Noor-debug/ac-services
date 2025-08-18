// api/send-whatsapp.js
const twilio = require('twilio');

module.exports = async (req, res) => {
  // CORS for GitHub Pages or any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, location, service, notes } = req.body || {};

    if (!name || !phone || !location || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = [
      '📢 New AC Request',
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      `📍 Location: ${location}`,
      `🛠 Service: ${service}`,
      notes ? `📝 Notes: ${notes}` : null
    ].filter(Boolean).join('\n');

    await client.messages.create({
      from: 'whatsapp:+14155238886',     // Twilio WhatsApp Sandbox
      to:   'whatsapp:+966570552609',    // Your WhatsApp number
      body: message
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Twilio error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
