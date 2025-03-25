import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";

// Chat Component Files
import ChatInput from '../ChatInput/ChatInput.jsx';
import ChatSidebar from '../ChatSidebar/ChatSidebar.jsx';
import MessageList from '../ChatMessages/MessageList.jsx';
import './Chat.css';

// Services
import {uploadFile} from '../../services/fileUpload.js';
import {postMessage} from '../../services/message.js';


const socket = io.connect(`http://localhost:3001/`);
const Chat = ({user}) => {
    user = user ? user.email : null;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newContactEmail = queryParams.get("newcontactemail");

    const [otherUsers, setOtherUsers] = useState([]);
    const [curOtherUser, setCurOtherUser] = useState(newContactEmail);
    const [roomId, setRoomId] = useState("");
    const [curMessage, setCurMessage] = useState("");
    const [curFile, setCurFile] = useState(null);
    const [chatHistory, setChatHistory] = useState({}); 
    const [lastMessages, setLastMessages] = useState({});
    const [notifications, setNotifications] = useState({});
    const [firstUnreadMessage, setFirstUnreadMessage] = useState(null);
    const [clearUnread, setClearUnread] = useState(null);
    const [userDetails, setUserDetails] = useState({ email: "", username: "" });
    
    const fetchUserDetails = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        try {
            const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
            const userData = res.data;
            setUserDetails({ email: userData.email, username: userData.username });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    
    // Run this when the component mounts
    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchContacts = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login to chat');
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
            const user  = res.data;
            const contacts = await Promise.all(
            user.contacts.map(async (contact) => {
                const contactUser = await axios.get(`http://localhost:3001/api/users/${contact.user}`);
                return {
                    email: contactUser.data.email,
                    username: contactUser.data.username,
                    profilePicture: contactUser.data.profilePicture,
                    lastMessage: contact.lastMessage,
                    userId: contact.user
                };
            }));

            setOtherUsers(contacts);
            
            const newNotifications = {};

            await Promise.all(contacts.map(async (otherUser) => {
                const room = getRoomId(user.email, otherUser.email);
                const messages = await fetchMessages(room);

                // Calculating unread messages
                const unreadCount = messages.filter(message => !message.read).length;
                newNotifications[otherUser.userId] = { count: unreadCount };

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

    const fetchMessages = async (room, limit, skip) => {
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
        fetchContacts();
    }, [user]);

    useEffect(() => {
        sortUsersByRecency();
    }, [lastMessages]); 

    const getRoomId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort();
        return sortedUsers.join('_');
    };

    const joinRoom = async (otherUser) => {
        setCurOtherUser(otherUser);
        const newRoomId = getRoomId(user, otherUser);
        setRoomId(newRoomId);
        const messages = await fetchMessages(newRoomId);
        console.log(messages);

        // Identify unread messages
        const unreadMessages = messages.filter(msg => !msg.read && msg.author !== user);

        if (unreadMessages.length > 0) {
            const firstUnreadMessage = unreadMessages[0];
            setFirstUnreadMessage(firstUnreadMessage);
            setClearUnread(false);
        } else {
            setClearUnread(true);
        }

        // Marks all messages to read when joining a room
        await markMessagesAsRead(newRoomId, otherUser.userId);

        // Resets notifications
        setChatHistory(prev => ({
            ...prev,
            [newRoomId]: messages.map(msg => ({ ...msg, read: true }))
        }));

        setNotifications(prev => ({
            ...prev,
            [otherUser.userId]: { count: 0 }
        }))

        socket.emit("join_room", newRoomId);
    };

    const markMessagesAsRead = async (roomId) => {
        try {
            await axios.post(`http://localhost:3001/api/message/read`, { roomId });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const sendMessage = async () => {
        if ((curMessage === "" && !curFile) || roomId === "") {
            return;
        }

        const messageData = {
            roomId: roomId,
            author: userDetails.email,
            username: userDetails.username,
            content: curMessage,
            date: new Date(),
            read: true
        };
        console.log(userDetails);

        console.log(messageData);

        if (curFile) {
            messageData.file = {
                name: curFile.name,
                url: await uploadFile(curFile)
            }
        }

        socket.emit("send_message", messageData);
        
        updateLatestMessages(messageData);
        setCurMessage("");
        setCurFile(null);
        await postMessage(messageData);

        try {
            await axios.post("http://localhost:3001/api/users/updateLastMessage", {
                user1Email: user,
                user2Email: curOtherUser,
                messageContent: messageData.content
            });
        } catch (error) {
            console.error("Error updating last message:", error);
        }
    };

    if (!user) return <h1>Please login</h1>;

    return (
        <div className="chat-container">
            <ChatSidebar
                joinRoom={joinRoom}
                otherUsers={otherUsers}
                curOtherUser={curOtherUser}
                notifications={notifications}
            />
            <div className="chat-main">
                <div className="chat-header">
                    {curOtherUser? <img
                        src={otherUsers.find(user => user.email === curOtherUser)?.profilePicture} 
                        alt={curOtherUser ? otherUsers.find(user => user.email === curOtherUser)?.username : 'User'}
                    /> : null}
                    <h2>
                        {curOtherUser ? (otherUsers.find(user => user.email === curOtherUser)?.username 
                        || curOtherUser) : `Welcome, ${userDetails.username}`}
                    </h2>
                </div>
                <MessageList
                    chatHistory={chatHistory}
                    roomId={roomId}
                    user={user}
                    firstUnreadMessage={firstUnreadMessage}
                    clearUnread={clearUnread}
                    curOtherUser={curOtherUser}
                />
                {curOtherUser && (
                    <ChatInput
                        curMessage={curMessage}
                        setCurMessage={setCurMessage}
                        curFile={curFile}
                        setCurFile={setCurFile}
                        sendMessage={sendMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;