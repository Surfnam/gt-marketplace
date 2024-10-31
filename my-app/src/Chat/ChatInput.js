import React from 'react';
import './ChatInput.css';

const ChatInput = ({ curMessage, setCurMessage, curFile, setCurFile, sendMessage }) => {
    return (
        <div className="chat-input">
            <label htmlFor="file-upload" className="file-upload-label">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    width="40" 
                    height="40" 
                    fill="currentColor" 
                >
                    <path 
                        d="M16.5 6.5v10a4.5 4.5 0 01-9 0v-9a3.5 3.5 0 017 0v9a2.5 2.5 0 01-5 0v-8h1v8a1.5 1.5 0 003 0v-9a2.5 2.5 0 00-5 0v9a4.5 4.5 0 009 0v-10h1z"
                    />
                </svg>
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