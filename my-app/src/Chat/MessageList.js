import React, { useState, useEffect, useRef } from 'react';

// Chat Component Files
import NewDayLine from './NewDayLine';
import UnreadMessageLine from './UnreadMessageLine';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ chatHistory, roomId, user, firstUnreadMessage, clearUnread, curOtherUser }) => {
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [curOtherUser, chatHistory]);

    return (
        <div className="messages-container">
            {(chatHistory[roomId] || []).map((message, idx) => {
                const isFirstMessage = idx === 0;
                const lastAuthor = isFirstMessage ? null : chatHistory[roomId][idx - 1].author;

                const currentMessageDate = new Date(message.date);
                const previousMessageDate = idx > 0 ? new Date(chatHistory[roomId][idx - 1].date) : null;
        
                return (
                    <React.Fragment key={idx}>
                        <NewDayLine 
                            currentMessageDate={currentMessageDate}
                            previousMessageDate={previousMessageDate}
                        />
                        <UnreadMessageLine 
                            message={message}
                            firstUnreadMessage={firstUnreadMessage}
                            clearUnread={clearUnread}
                        />
                        <Message 
                            user={user}
                            isFirstMessage={isFirstMessage}
                            lastAuthor={lastAuthor}
                            message={message}
                            currentMessageDate={currentMessageDate}
                            previousMessageDate={previousMessageDate}
                            onHover={() => setHoveredMessageId(message._id)}
                            onLeave={() => setHoveredMessageId(null)}
                        />
                        {hoveredMessageId === message._id && (
                            <div className="hover-box">
                                {/* This box will eventually contain buttons */}
                                <p>Action</p>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList;