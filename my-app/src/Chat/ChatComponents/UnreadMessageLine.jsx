import React from 'react';
import './UnreadMessageLine.css';

const UnreadMessageLine = ({ message, firstUnreadMessage, clearUnread }) => {
    const isFirstUnreadMessage = firstUnreadMessage && message._id === firstUnreadMessage._id;

    if (!isFirstUnreadMessage || clearUnread) return null

    return (
        <div className="unread-messages-line">
            <span className="line-unread">Unread</span>
        </div>
    )
}

export default UnreadMessageLine;