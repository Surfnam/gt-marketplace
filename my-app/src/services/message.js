import axios from 'axios';

const baseURL = 'http://localhost:3001';

export const postMessage = async (message) => {
    try {
        const res = await axios.post(`${baseURL}/api/message`, message);
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}