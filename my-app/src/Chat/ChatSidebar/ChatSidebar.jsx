import React, {useState} from 'react';
import './ChatSidebar.css';
import { IoIosSearch, IoMdMenu, IoMdClose } from "react-icons/io";

const ChatSidebar = ({ joinRoom, otherUsers, curOtherUser, notifications }) => {
    // Filtering user checking
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = otherUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (user.lastMessage && user.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleUserClick = (userEmail) => {
        joinRoom(userEmail);
        setIsOpen(false);
    };

    return (
        <>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? (<IoMdClose className="hamburger-icon" />) 
                : (<IoMdMenu className="hamburger-icon" />)
                }
            </div>

            <div className={`chat-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
                <h2>Chats</h2>
                <div className="chat-search">
                    <IoIosSearch className="icon" />
                    <input 
                        type="text" 
                        placeholder="Search Messages" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul>
                    {filteredUsers.map((otherUser) => (
                        <div className="border-top" key={otherUser.email}>
                            <li 
                                onClick={() => handleUserClick(otherUser.email)}
                                className={`user ${curOtherUser === otherUser.email ? 'selected' : ''}`} 
                            >  
                                <div className="profile-pic">
                                    <img 
                                        src={otherUser.profilePicture} 
                                        alt={`${otherUser.username}'s profile`} 
                                        className="profile-pic-img" 
                                    />
                                </div>
                                <div className="user-description">
                                    <span className={`username ${notifications[otherUser.email]?.count > 0 ? 'notif' : ''}`}>
                                        {otherUser.username.length > 17 ? otherUser.username.substring(0, 17) + "..." : otherUser.username}
                                    </span>
                                    <span className={`message ${notifications[otherUser.email]?.count > 0 ? 'notif' : ''}`}>
                                        {otherUser.lastMessage.length > 25 ? otherUser.lastMessage.substring(0, 25) + "..." : otherUser.lastMessage}
                                    </span>
                                </div>
                                {notifications[otherUser.email]?.count > 0 && 
                                    <span className="notif-circle">
                                        {notifications[otherUser.email].count > 10 ? "10+" 
                                        : notifications[otherUser.email].count}
                                    </span>
                                }
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ChatSidebar;