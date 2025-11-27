import emailjs from "emailjs-com";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmails = async (formData: ContactFormData): Promise<void> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const adminTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN;
  const clientTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT;

  // Send email to admin
  await emailjs.send(
    serviceId,
    adminTemplate,
    {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    },
    publicKey
  );

  // Send confirmation email to client
  await emailjs.send(
    serviceId,
    clientTemplate,
    {
      to_name: formData.name,
      to_email: formData.email,
    },
    publicKey
  );
};