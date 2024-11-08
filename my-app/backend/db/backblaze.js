import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Backblaze S3 client
const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

/**
 * Upload a file to Backblaze and return the URL
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The original file name
 * @returns {string} The URL of the uploaded file
 */
export const uploadFileToBackblaze = async (fileBuffer, fileName) => {
  const bucketName = 'GTMarketplace';
  const keyName = `uploads/${uuidv4()}`;

  try {
    // Determine the MIME type dynamically based on the file extension
    const contentType = mime.lookup(fileName) || 'application/octet-stream'; // Default to binary stream if MIME type is unknown

    const params = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileBuffer,
      ContentType: contentType, // Set the MIME type dynamically
    };

    // Upload the file
    await s3.send(new PutObjectCommand(params));

    // Construct the URL that it is stored at
    const fileUrl = `https://s3.${process.env.AWS_REGION}.backblazeb2.com/${bucketName}/${keyName}`;
    
    return fileUrl;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Failed to upload file to Backblaze');
  }
};
