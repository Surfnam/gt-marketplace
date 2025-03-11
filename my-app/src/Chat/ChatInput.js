import React from 'react';
import './ChatInput.css';
import { FaPlus } from "react-icons/fa6";
import { TbSend2 } from "react-icons/tb";

const ChatInput = ({ curMessage, setCurMessage, curFile, setCurFile, sendMessage }) => {
    return (
        <div className="chat-input">
            <label htmlFor="file-upload" className="file-upload-label">
                <FaPlus className="plus-icon" />
            </label>
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
                className="input-box"
                type="text" 
                placeholder="Type a message..." 
                onChange={e => setCurMessage(e.target.value)}
                value={curMessage}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
                <TbSend2 />
            </button>
        </div>   
    )
}

export default ChatInput;