import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chat Component Files
import NewDayLine from './NewDayLine';
import UnreadMessageLine from './UnreadMessageLine';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ chatHistory, roomId, user, firstUnreadMessage, clearUnread, curOtherUser, fetchMoreMessages, containerRef, skip, setSkip }) => {
    const [loading, setLoading] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [curOtherUser, chatHistory]);

    const handleScroll = useCallback(() => {
        if (containerRef.current && containerRef.current.scrollTop === 0 && !loading) {
            setLoading(true);
            fetchMoreMessages()
                .then(() => {
                    setSkip((prevSkip) => prevSkip + 25);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [loading, fetchMoreMessages, setSkip]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <div className="messages-container" ref={containerRef}>
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
                        />
                    </React.Fragment>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList;