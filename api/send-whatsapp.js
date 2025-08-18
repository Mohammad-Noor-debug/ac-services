// api/send-whatsapp.js
import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Missing fields in request" });
    }

    // Load Twilio credentials from environment variables
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const whatsappMessage = `
📩 New AC Service Request:
👤 Name: ${name}
📱 Phone: ${phone}
📝 Request: ${message}
    `;

    // ⚠️ Replace 'from' with your Twilio WhatsApp sandbox number
    // ⚠️ Replace 'to' with your personal WhatsApp number
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
