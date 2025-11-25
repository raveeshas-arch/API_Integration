import express from 'express';
import { upload } from '../config/s3.js';
import { uploadProfilePicture } from '../controller/uploadController.js';

const router = express.Router();

router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

export default router;