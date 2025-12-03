import nodemailer from "nodemailer";
import config from '../config/config.js';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"${config.email.fromName}" <${config.email.from}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`Email sent to ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}