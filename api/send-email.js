import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing fields in request" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = 'ac-services@resend.dev'; // You can use a custom domain if verified, or use @resend.dev

    const data = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (data.error) {
      throw new Error(data.error.message || 'Resend API error');
    }

    return res.status(200).json({ success: true, info: data });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,
      stack: error.stack,
    });
  }
}
