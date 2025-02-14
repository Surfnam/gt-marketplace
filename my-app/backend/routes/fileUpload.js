import express from 'express';
import { uploadFile } from '../controllers/fileController.js';
import multer from 'multer';

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// Route for uploading a file
router.put('/', upload.single('file'), uploadFile);

export default router;
