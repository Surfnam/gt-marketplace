import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from "socket.io-client";

// Chat Component Files
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import './Chat.css';

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
    const [firstUnreadMessage, setFirstUnreadMessage] = useState(null);
    const [clearUnread, setClearUnread] = useState(null);
    const [skip, setSkip] = useState(0);
    const containerRef = useRef(null);

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

    const fetchMessages = async (room, limit = 20, skip) => {
        try {
            const res = await axios.get(`http://localhost:3001/api/message/${room}?limit=${limit}&skip=${skip}`);

            return res.data.map(message => ({
                ...message,
                date: new Date(message.date),
                read: message.read
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const fetchMoreMessages = async () => {
        if (!roomId || !containerRef.current) return;
    
        const container = containerRef.current;
        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;
    
        try {
            const moreMessages = await fetchMessages(roomId, 25, skip);
    
            setChatHistory((prev) => ({
                ...prev,
                [roomId]: [...moreMessages, ...(prev[roomId] || [])],
            }));
    
            setSkip((prevSkip) => prevSkip + moreMessages.length);
    
            setTimeout(() => {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
            }, 0);
        } catch (error) {
            console.error('Error loading more messages:', error);
        }
    };

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

    const getRoomId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort();
        return sortedUsers.join('_');
    };

    const joinRoom = async (otherUser) => {
        setCurOtherUser(otherUser);
        const newRoomId = getRoomId(user, otherUser);
        setRoomId(newRoomId);

        const messages = await fetchMessages(newRoomId);

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
            await axios.post(`http://localhost:3001/api/message/read`, { roomId });
            setClearUnread(true);
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
                <h2>{curOtherUser ? curOtherUser : `Welcome, ${user}`}</h2>
                <MessageList
                    chatHistory={chatHistory}
                    roomId={roomId}
                    user={user}
                    firstUnreadMessage={firstUnreadMessage}
                    clearUnread={clearUnread}
                    curOtherUser={curOtherUser}
                    fetchMoreMessages={fetchMoreMessages}
                    containerRef={containerRef}
                    skip={skip}
                    setSkip={setSkip}
                />
                {curOtherUser && (
                    <ChatInput
                        curMessage={curMessage}
                        setCurMessage={setCurMessage}
                        sendMessage={sendMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;