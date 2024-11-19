import axios from 'axios';

const baseURL = 'http://localhost:3001';

export const postMessage = async (message) => {
    try {
        const res = await axios.post(`${baseURL}/api/message`, message);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

export const fetchMessages = async (room, limit, skip) => {
    try {
        const res = await axios.get(`http://localhost:3001/api/message/${room}?limit=${limit}&skip=${skip}`);

        return res.data.map(message => ({
            ...message,
            date: new Date(message.date),
            read: message.read
        }));
    } catch (error) {
        console.error('Error fetcing messages:', error);
    }
}

export const markMessagesAsRead = async (roomId) => {
    try {
        await axios.post(`http://localhost:3001/api/message/read`, { roomId });
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

export const fetchAllUsers = async () => {
    try {
        const res = await axios.get('http://localhost:3001/api/users');
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}