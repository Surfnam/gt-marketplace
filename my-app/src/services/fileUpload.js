import axios from 'axios';

const baseUrl = 'http://localhost:3001';
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await axios.put(`${baseUrl}/api/fileUpload`, formData);
        return res.data;
    } catch (err) {
        console.error("Error uploading file:", err);
    }
}

export default {uploadFile};