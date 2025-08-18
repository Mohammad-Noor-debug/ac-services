// api/send-whatsapp.js
import twilio from "twilio";
// If using CommonJS, use: const twilio = require('twilio');

export default async function handler(req, res) {
  // Allow CORS for local development and browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Support both Express and Next.js API routes
    const body = req.body || (req.body === undefined && req.method === 'POST' && req.headers['content-type'] === 'application/json' ? await getRawBody(req) : {});
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Missing fields in request" });
    }

    // Validate phone number format (basic)
    if (!/^\d{9,15}$/.test(phone.replace(/[^\d]/g, ''))) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Load Twilio credentials from environment variables
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ error: "Twilio credentials not set in environment variables" });
    }
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const whatsappMessage = `\n📩 New AC Service Request:\n👤 Name: ${name}\n📱 Phone: ${phone}\n📝 Request: ${message}\n`;

    // Replace 'from' and 'to' with your Twilio WhatsApp sandbox and personal WhatsApp number
    const response = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox number
      to: "whatsapp:966570552609",   // Your personal WhatsApp number
      body: whatsappMessage,
    });

    console.log("✅ WhatsApp message sent:", response.sid);
    return res.status(200).json({ success: true, sid: response.sid });

  } catch (error) {
    console.error("❌ WhatsApp send failed:", error);
    return res.status(500).json({
      error: "Failed to send WhatsApp message",
      details: error.message,
      stack: error.stack,
    });
  }
}

// Helper for raw body parsing (for Express/Node.js)
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}
