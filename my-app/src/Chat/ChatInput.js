import React from 'react';
import './ChatInput.css';
import { FaPlus } from "react-icons/fa6";

const ChatInput = ({ curMessage, setCurMessage, curFile, setCurFile, sendMessage }) => {
    return (
        <div className="chat-input">
            <FaPlus className="plus-icon" />
            <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={(e) => setCurFile(e.target.files[0])}
            />
            {curFile && (
                <p style={{margin: `5px 14px 0px 0px`}}>{curFile.name}</p>
            )}
            <input 
                type="text" 
                placeholder="Type a message..." 
                onChange={e => setCurMessage(e.target.value)}
                value={curMessage}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>   
    )
}

export default ChatInput;