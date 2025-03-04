import React, { useState, useEffect, useRef } from 'react';

// Chat Component Files
import NewDayLine from './NewDayLine';
import UnreadMessageLine from './UnreadMessageLine';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ chatHistory, roomId, user, firstUnreadMessage, clearUnread, curOtherUser }) => {
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const messagesEndRef = useRef(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [curOtherUser, chatHistory]);

    const fileExtension = selectedMedia?.name.split('.').pop().toLowerCase();
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
                            setSelectedMedia={setSelectedMedia}
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
            
            {selectedMedia && (
                <>
                    <div className="modal-overlay" onClick={() => setSelectedMedia(null)}></div>

                    <div className="modal">
                        <div className="modal-content" >
                            {
                                ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) ? (
                                    <img src={selectedMedia.url} alt="Preview" className="modal-media" />
                                ) : (
                                    <video controls className="modal-media">
                                        <source src={selectedMedia.url} type={`video/${fileExtension}`} />
                                        Your browser does not support the video tag.
                                    </video>
                            )}
                        </div>
                        <a className="selectedMedia-link" href={selectedMedia.url} target="_blank">
                            Open in Browser
                        </a>
                    </div>
                </>
            )}
        </div>
    )
}

export default MessageList;