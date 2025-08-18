// api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing fields in request" });
    }

    // Configure transporter (use environment variables for security)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, info });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,
      stack: error.stack,
    });
  }
}
