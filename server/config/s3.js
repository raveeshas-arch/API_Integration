import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import config from './config.js';

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Upload to S3 using AWS SDK v3
export const uploadToS3 = async (file, folder = 'profile-pictures') => {
  try {
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    });

    await s3Client.send(command);
    const imageUrl = `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
    return imageUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export { upload };