import express from 'express';
import { upload } from '../config/s3.js';
import { uploadProfilePicture } from '../controller/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();

router.post('/profile-picture',requireAuth, upload.single('profilePicture'), uploadProfilePicture);

export default router;