import { uploadFileToBackblaze } from '../db/backblaze.js';

/**
 * Handle the file upload process.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const uploadFile = async (req, res) => {
  // Check if the file exists
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const fileURL = await uploadFileToBackblaze(fileBuffer, fileType); // Call the function that handles the upload
    
    res.json({ fileURL }); // Respond with the file URL
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
