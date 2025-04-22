import axios from 'axios';

const baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

export const postMessage = async (message) => {
    try {
        const res = await axios.post(`${baseURL}/api/message`, message);
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}