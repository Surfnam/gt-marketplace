import React, { useState, useEffect } from 'react';
import './Chat.css';
import axios from 'axios';
import io from "socket.io-client";
//const backendPort = '5000';
const socket = io.connect(`http://localhost:5000/`);
const Chat = ({user}) => {
    const [users, setUsers] = useState([]);
    const [curOtherUser, setCurOtherUser] = useState(users[0]);
    const [curMessage, setCurMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [roomId, setRoomId] = useState("");

    const username = user ? user.email : null;

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList(prev => [...prev, data]);
        });
    }, [socket]);

    useEffect(() => {
        const fetchAllUsers = async () => {
          try {
            const res = await axios.get('http://localhost:5000/api/users');
            let usersData = res.data;
            usersData = usersData.filter(u => u.email !== user.email);
            usersData = usersData.map(u => u.email);
            console.log(usersData);
            setUsers(usersData);
            /*if (usersData.length > 0) {
              joinRoom(usersData[0]);
            }*/
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchAllUsers();
      }, [username]);

    if (!user) {
        return <h1>Please login</h1>
    }

    const getRoomId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort();
        return sortedUsers.join('_');
    }

    const joinRoom = (otherUser) => {
       setCurOtherUser(otherUser);
       const newRoomId = getRoomId(username, otherUser);
       setRoomId(newRoomId);
       socket.emit("join_room", newRoomId);
    }

    const sendMessage = () => {
        if (curMessage === "" || roomId == "") {
            return;
        }

        const messageData = {
            room: roomId,
            author: username,
            content: curMessage,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        };
        
        socket.emit("send_message", messageData);
        setMessageList(prev => [...prev, messageData]);
        console.log(messageList);
        setCurMessage("");
    }

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Chats</h2>
                <ul>
                    {users.map((user, idx) => (
                    <li key={idx} onClick={() => joinRoom(user)}>
                        {user}
                    </li>
                    ))}
                </ul>
            </div>
            <div className="chat-main">
                <h2>{curOtherUser}</h2>
                <div className="chat-messages">
                    {messageList.map((message, idx) => (
                        <div className={`message ${username === message.author ? 'you' : 'other'}`}>
                            <div className="message-meta">
                                <p>{message.time}</p>
                                <p>{message.author}</p>
                            </div>
                            <div className="message-content">
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
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