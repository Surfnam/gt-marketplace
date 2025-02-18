import axios from 'axios';

const baseURL = 'http://localhost:3001';
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await axios.put(`${baseURL}/api/fileUpload`, formData);
        return res.data.fileURL;
    } catch (err) {
        console.error("Error uploading file:", err.response ? err.response.data : err.message);
    }
}
