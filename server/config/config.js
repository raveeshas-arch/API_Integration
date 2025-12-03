import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert ES module URL into absolute file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory of the current file
const __dirname = path.dirname(__filename);

// Load environment variables from ../.env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Export all configuration settings in a single object
const config = {
  // Application-level configuration
  app: {
    name: process.env.APP_NAME,          
    version: process.env.APP_VERSION,    
    env: process.env.NODE_ENV,         
    port: parseInt(process.env.PORT) || 8000  
  },

  // Database configuration (MongoDB)
  database: {
    mongoUrl: process.env.MONGO_URL      
  },

  // Frontend client URL (CORS usage)
  client: {
    url: process.env.CLIENT_URL       
  },

  // JWT authentication settings
  jwt: {
    secret: process.env.JWT_SECRET,      // Secret key to sign JWT tokens
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"  
  },
  
  // AWS (S3) configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,         
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
    region: process.env.AWS_REGION,                     
    s3Bucket: process.env.AWS_S3_BUCKET                 
  },

  // Email sending configuration (Nodemailer)
  email: {
    host: process.env.EMAIL_HOST,                     
    port: parseInt(process.env.EMAIL_PORT),             
    secure: process.env.EMAIL_SECURE === 'true',        
    user: process.env.EMAIL_USER,                       
    password: process.env.EMAIL_PASSWORD,               
    from: process.env.EMAIL_FROM ,
    fromName: process.env.EMAIL_FROM_NAME               
  }
};

export default config;
