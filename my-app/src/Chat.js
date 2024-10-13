import React from 'react';
import './Chat.css';
import io from "socket.io-client";
const backendPort = '5000';
const socket = io.connect(`http://localhost:5000/`);
const Chat = () => {
    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Chats</h2>
                <ul>
                    <li>User 1</li>
                    <li>User 2</li>
                    <li>User 3</li>
                    {/* Add more users as needed */}
                </ul>
            </div>
            <div className="chat-main">
                <h2>Main Chat</h2>
                <div className="chat-messages">
                    {/* Chat messages will go here */}
                </div>
                <div className="chat-input">
                    <input type="text" placeholder="Type a message..." />
                    <button>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;