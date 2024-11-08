import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005'
});

/**
 * Upload a file to Backblaze and return the URL
 * @param {Buffer} fileBuffer - The file buffer
 * @returns {string} The URL of the uploaded file
 */
export const uploadFileToBackblaze = async (fileBuffer, fileType) => {
  const bucketName = 'GTMarketplace';
  const keyName = `${uuidv4()}`;

  try {
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: keyName,
      Body: fileBuffer,
      ContentType: fileType
    }));

    return `https://${bucketName}.s3.us-east-005.backblazeb2.com/${keyName}`
  
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new Error('Failed to upload file to Backblaze');
  }
};
