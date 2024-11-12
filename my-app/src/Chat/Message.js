import React from 'react';
import './Message.css';

const Message = ({ user, isFirstMessage, lastAuthor, message, currentMessageDate, previousMessageDate, onHover, onLeave }) => {

    const timeDifference = currentMessageDate - previousMessageDate;

    const getFullDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);

        const isToday = messageDate.getDate() === today.getDate() &&
                        messageDate.getMonth() === today.getMonth() &&
                        messageDate.getFullYear() === today.getFullYear();

        const isYesterday = messageDate.getDate() + 1 === today.getDate() &&
                            messageDate.getMonth() === today.getMonth() &&
                            messageDate.getFullYear() === today.getFullYear();

        // Formats hours correctly
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const AMPM = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight and handle 12-hour format
        const timeString =  `${adjustedHours}:${String(minutes).padStart(2, '0')} ${AMPM}`;

        if (isToday) {
            return `Today at ${timeString}`;
        } else if (isYesterday) {
            return `Yesterday at ${timeString}`
        } else {
            const formattedDate = `${String(messageDate.getMonth() + 1)
                                    .padStart(2, '0')}/${String(messageDate.getDate())
                                    .padStart(2, '0')}/${messageDate.getFullYear()} ${timeString}`;
            return formattedDate;
        }
    };

    return (
        <div 
            className={`message ${user === message.author ? 'you' : 'other'}`} 
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {(isFirstMessage || lastAuthor !== message.author || timeDifference > 10 * 60 * 1000) && (
                <div className="message-meta">
                    <p className="author">{message.author}</p>
                    <p className="date">{getFullDate(message.date)}</p>
                </div>
            )}
            {message.content.length > 0 && (
                <div className="message-content">
                    <p>{message.content}</p>
                </div>
            )}
            {message.file && (
                <img 
                    className="message-file"
                    src={message.file}
                    alt="Sent file"
                />
            )}
        </div>
    )
}

export default Message;