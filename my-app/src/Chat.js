import React, { useState, useEffect } from 'react';
import './Chat.css';
import axios from 'axios';
import io from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
//const backendPort = '5000';
const socket = io.connect(`http://localhost:5000/`);
const Chat = ({user}) => {
    console.log("rerender");
    user = user ? user.email : null;
    const [otherUsers, setOtherUsers] = useState([]);
    const [curOtherUser, setCurOtherUser] = useState(otherUsers[0]);
    const [roomId, setRoomId] = useState("");
    const [curMessage, setCurMessage] = useState("");
    const [chatHistory, setChatHistory] = useState({}); 
    const [lastMessages, setLastMessages] = useState({});

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            let usersData = res.data;
            usersData = usersData.filter(u => u.email !== user).map(u => u.email);
            setOtherUsers(usersData);
            
            //
            await Promise.all(usersData.map(async (otherUser) => {
                const room = getRoomId(user, otherUser);
                const messages = await fetchMessages(room);
                if (messages.length > 0) {
                    const latestMessage = messages[messages.length - 1];
                    updateLatestMessages(latestMessage);
                }
            }));

            console.log(lastMessages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const fetchMessages = async (room) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/message/${room}`);
            const messageData = res.data;
            return messageData.map(message => ({
                ...message,
                date: new Date(message.date)
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const sendMessageToServer = async (messageData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/message', messageData);
            return res.data;
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    const updateLatestMessages = (messageData) => {
        const [user1, user2] = messageData.roomId.split('_');
        setLastMessages(prev => ({
            ...prev,
            [user1]: messageData.date,
            [user2]: messageData.date,
        }));
    }
    useEffect(() => {
        socket.on("receive_message", (data) => {
            const formattedData = {...data, date: new Date(data.date)}
            
            setChatHistory(prevChatHistory => {
                const updatedRoomMessages = [...(prevChatHistory[data.roomId] || []), formattedData];
                return { ...prevChatHistory, [data.roomId]: updatedRoomMessages };
            });

            updateLatestMessages(data);
        });
    }, [socket]);

    useEffect(() => {
        fetchAllUsers();
    }, [user]);

    useEffect(() => {
        const sortedUsers = [...otherUsers].sort((a, b) => {
            const timeA = lastMessages[a] ? new Date(lastMessages[a]).getTime() : 0;
            const timeB = lastMessages[b] ? new Date(lastMessages[b]).getTime() : 0;
            return timeB - timeA; // Sort in descending order
        });
        setOtherUsers(sortedUsers);
        console.log(sortedUsers);
    }, [lastMessages]); 

    if (!user) {
        return <h1>Please login</h1>
    }


    const getRoomId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort();
        return sortedUsers.join('_');
    }

    const joinRoom = async (otherUser) => {
        console.log("joined");
        setCurOtherUser(otherUser);
        const newRoomId = getRoomId(user, otherUser);
        setRoomId(newRoomId);

        const messages = await fetchMessages(newRoomId);
        setChatHistory(prev => ({
            ...prev,
            [newRoomId]: messages,
        }));

        socket.emit("join_room", newRoomId);
    }

    const sendMessage = async () => {
        if (curMessage === "" || roomId === "") {
            return;
        }

        const messageData = {
            roomId: roomId,
            author: user,
            content: curMessage,
            date: new Date(),
        };
        
        socket.emit("send_message", messageData);
        
        updateLatestMessages(messageData);
        /*setChatHistory(prev => ({
            ...prev, 
            [roomId]: [...(prev[roomId] || []), messageData]
        }));*/

        setCurMessage("");
       
        const savedMessage = await sendMessageToServer(messageData);
    }

    
    const getAMPM = (date) => {
        //date = new Date(date);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const AMPM = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight and handle 12-hour format
        return `${adjustedHours}:${String(minutes).padStart(2, '0')} ${AMPM}`;
    }

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Chats</h2>
                <ul>
                    {otherUsers.map((otherUser, idx) => (
                        <li key={idx} onClick={() => joinRoom(otherUser)}>
                            {otherUser/*Decide whether to use email or name*/} 
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-main">
                <h2>{curOtherUser ? curOtherUser : ''}</h2>
                <ScrollToBottom className="messages-container">
                    {(chatHistory[roomId] || []).map((message, idx) => (
                        <div key={idx} className={`message ${user === message.author ? 'you' : 'other'}`}>
                            <div className="message-meta">
                                <p>{getAMPM(message.date)}</p>
                                <p>{message.author}</p>
                            </div>
                            <div className="message-content">
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </ScrollToBottom>
                <div className="chat-input">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        onChange={e => setCurMessage(e.target.value)}
                        value={curMessage}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;