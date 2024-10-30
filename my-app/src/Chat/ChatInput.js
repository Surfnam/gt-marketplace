import React from 'react';
import './Chat.css';

const ChatInput = ({ curMessage, setCurMessage, sendMessage }) => {
    return (
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
    )
}

export default ChatInput;