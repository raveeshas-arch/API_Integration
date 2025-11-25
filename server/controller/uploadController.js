import { uploadToS3 } from '../config/s3.js';
import adminModel from '../models/adminModel.js';
import mongoose from 'mongoose';

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    let imageUrl;
    try {
      imageUrl = await uploadToS3(req.file);
    } catch (s3Error) {
      console.log('S3 upload failed, using base64:', s3Error.message);
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    
    const { userId } = req.body;
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      await adminModel.findByIdAndUpdate(
        userId, 
        { profilePic: imageUrl }, 
        { new: true }
      );
    }
    
    res.json({ 
      success: true, 
      imageUrl,
      message: 'Profile picture uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Upload failed', 
      details: error.message 
    });
  }
};