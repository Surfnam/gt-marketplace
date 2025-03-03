import React from 'react';
import './ChatSidebar.css';
import { IoIosSearch } from "react-icons/io";

const ChatSidebar = ({ joinRoom, otherUsers, curOtherUser, notifications }) => {
    return (
        <div className="chat-sidebar">
            <h2>Chats</h2>
            <div className="chat-search">
                <IoIosSearch className="icon" />
                <input type="text" placeholder="Search Messages" />
            </div>
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
    )
}

export default ChatSidebar;