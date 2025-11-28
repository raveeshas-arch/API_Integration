// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// export default transporter;
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', 
  port: 587,                 
  secure: false,           
  auth: {
    user: process.env.SMTP_USER,       
    pass: process.env.SMTP_PASSWORD    
  },
  tls: {
    rejectUnauthorized: false
  }
});

// verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email transporter error:", error);
  } else {
    console.log("Email transporter ready to send messages!");
  }
});

export default transporter;
