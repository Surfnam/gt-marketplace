import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axios from 'axios';
import io from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';

const socket = io.connect(`http://localhost:3001/`);
const Chat = ({user}) => {
    user = user ? user.email : null;
    const [otherUsers, setOtherUsers] = useState([]);
    const [curOtherUser, setCurOtherUser] = useState(otherUsers[0]);
    const [roomId, setRoomId] = useState("");
    const [curMessage, setCurMessage] = useState("");
    const [chatHistory, setChatHistory] = useState({}); 
    const [lastMessages, setLastMessages] = useState({});
    const [notifications, setNotifications] = useState({});
    const [unreadMessages, setUnreadMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/users');
            let usersData = res.data;
            usersData = usersData.filter(u => u.email !== user).map(u => u.email);
            setOtherUsers(usersData);
            
            const newNotifications = {};

            await Promise.all(usersData.map(async (otherUser) => {
                const room = getRoomId(user, otherUser);
                const messages = await fetchMessages(room);

                // Calculating unread messages
                const unreadCount = messages.filter(message => !message.read).length;
                newNotifications[otherUser] = { count: unreadCount };

                if (messages.length > 0) {
                    const latestMessage = messages[messages.length - 1];
                    updateLatestMessages(latestMessage);
                }
            }));

            setNotifications(newNotifications);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const fetchMessages = async (room) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/message/${room}`);
            const messageData = res.data;
            return messageData.map(message => ({
                ...message,
                date: new Date(message.date),
                read: message.read
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const sendMessageToServer = async (messageData) => {
        try {
            const res = await axios.post('http://localhost:3001/api/message', messageData);
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

    const sortUsersByRecency = () => {
        const sortedUsers = [...otherUsers].sort((a, b) => {
            const timeA = lastMessages[a] ? new Date(lastMessages[a]).getTime() : 0;
            const timeB = lastMessages[b] ? new Date(lastMessages[b]).getTime() : 0;
            return timeB - timeA; // Sort in descending order
        });
        setOtherUsers(sortedUsers);
        console.log(sortedUsers);
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            const formattedData = { ...data, date: new Date(data.date) }
            
            setChatHistory(prevChatHistory => {
                const updatedRoomMessages = [...(prevChatHistory[data.roomId] || []), formattedData];
                return { ...prevChatHistory, [data.roomId]: updatedRoomMessages };
            });

            updateLatestMessages(data);

            // Sets notifications is user is not in room
            if (data.author !== user && curOtherUser !== data.author) {
                setNotifications(prev => ({
                    ...prev,
                    [data.author]: {
                        // Increments the count
                        count: (prev[data.author]?.count || 0) + 1
                    }
                }))
            }
        });

        return () => {
            socket.off("receive_message")
        };
    }, [curOtherUser]);

    useEffect(() => {
        fetchAllUsers();
    }, [user]);

    useEffect(() => {
        sortUsersByRecency();
    }, [lastMessages]); 

    useEffect(() => {
        // Scroll to bottom immediately when joining a new room
        if (roomId) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [roomId]);

    if (!user) {
        return <h1>Please login</h1>
    };

    const getRoomId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort();
        return sortedUsers.join('_');
    };

    const joinRoom = async (otherUser) => {
        setCurOtherUser(otherUser);
        const newRoomId = getRoomId(user, otherUser);
        setRoomId(newRoomId);

        const messages = await fetchMessages(newRoomId);
        
        messages.forEach(msg => {
            console.log(`Message from ${msg.author}: "${msg.content}" is ${msg.read ? 'read' : 'unread'}`);
        });

        // Identify unread messages
        const unreadMessages = messages.filter(msg => !msg.read && msg.author !== user);
        setUnreadMessages(unreadMessages);

        // Marks all messages to read when joining a room
        await markMessagesAsRead(newRoomId, otherUser);


        // Resets notifications
        setChatHistory(prev => ({
            ...prev,
            [newRoomId]: messages.map(msg => ({ ...msg, read: true }))
        }));

        setNotifications(prev => ({
            ...prev,
            [otherUser]: { count: 0 }
        }))

        socket.emit("join_room", newRoomId);
    };

    const markMessagesAsRead = async (roomId) => {
        try {
            const result = await axios.post(`http://localhost:3001/api/message/read`, { roomId });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const sendMessage = async () => {
        if (curMessage === "" || roomId === "") {
            return;
        }

        const messageData = {
            roomId: roomId,
            author: user,
            content: curMessage,
            date: new Date(),
            read: false
        };
        
        socket.emit("send_message", messageData);
        
        updateLatestMessages(messageData);
        setCurMessage("");
        await sendMessageToServer(messageData);
    };

    
    const getFullDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);

        const isToday = messageDate.getDate() === today.getDate() &&
                        messageDate.getMonth() === today.getMonth() &&
                        messageDate.getFullYear() === today.getFullYear();

        const isYesterday = messageDate.getDate() + 1 === today.getDate() &&
                            messageDate.getMonth() === today.getMonth() &&
                            messageDate.getFullYear() === today.getFullYear();

        // Formats hours correctly
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const AMPM = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight and handle 12-hour format
        const timeString =  `${adjustedHours}:${String(minutes).padStart(2, '0')} ${AMPM}`;

        if (isToday) {
            return `Today at ${timeString}`;
        } else if (isYesterday) {
            return `Yesterday at ${timeString}`
        } else {
            const formattedDate = `${String(messageDate.getMonth() + 1)
                                    .padStart(2, '0')}/${String(messageDate.getDate())
                                    .padStart(2, '0')}/${messageDate.getFullYear()} ${timeString}`;
            return formattedDate;
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Messages</h2>
                <ul>
                    {otherUsers.map((otherUser, idx) => (
                        <li key={idx} 
                            onClick={() => joinRoom(otherUser)}
                            className={`user ${curOtherUser === otherUser ? 'selected' : ''}`}>
                            <span className={`user ${notifications[otherUser]?.count > 0 ? 'notif' : ''}`}>
                                {otherUser}
                            </span>
                            {notifications[otherUser]?.count > 0 && 
                                <span className="notif-circle">
                                    {notifications[otherUser].count > 10 ? "10+" 
                                    : notifications[otherUser].count}
                                </span>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-main">
                <h2>{curOtherUser ? curOtherUser : ''}</h2>
                <ScrollToBottom className="messages-container">
                    {(chatHistory[roomId] || []).map((message, idx) => {
                        /* Displaying metadata for first message */
                        const isFirstMessage = idx === 0;
                        const lastAuthor = isFirstMessage ? null : chatHistory[roomId][idx - 1].author;

                        return (
                            <div key={idx} className={`message ${user === message.author ? 'you' : 'other'}`}>
                                {(isFirstMessage || lastAuthor !== message.author) && (
                                    <div className="message-meta">
                                        <p className="author">{message.author}</p>
                                        <p className="date">{getFullDate(message.date)}</p>
                                    </div>
                                )}
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
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