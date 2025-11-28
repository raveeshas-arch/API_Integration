import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  }
});

export const sendWelcomeEmail = async (email, name, generatedPassword) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome! Your Account Password",
      html: `<p>Welcome ${name}!</p><p>Your account has been created. Your login password is: <strong>${generatedPassword}</strong></p>`
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};