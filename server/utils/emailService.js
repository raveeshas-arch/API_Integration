import { sendEmail } from '../services/email.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName, replacements) => {
  const templatePath = path.join(__dirname, '../templates', templateName);
  let template = fs.readFileSync(templatePath, 'utf8');
  
  Object.keys(replacements).forEach(key => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  });
  
  return template;
};

export const sendRegistrationEmail = async (email, name, generatedPassword) => {
  try {
    const html = loadTemplate('registrationEmail.html', {
      name,
      email,
      password: generatedPassword
    });
    
    await sendEmail({
      to: email,
      subject: "Welcome! Your Account Password",
      html
    });
    
    return { success: true };
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    return { success: false, error: emailError };
  }
};