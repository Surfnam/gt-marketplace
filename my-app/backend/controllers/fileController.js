import { uploadFileToBackblaze } from '../db/backblaze.js';

/**
 * Handle the file upload process.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Upload file to Backblaze
    const fileUrl = await uploadFileToBackblaze(req.file.buffer, req.file.originalname);
    
    // Respond with the generated URL
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
