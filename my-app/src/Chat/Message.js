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

    const renderMessageFile = (file) => {
        console.log(file);
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            // Render image
            return (
                <img 
                    className="message-media"
                    src={file.url}
                    alt="Sent file"
                />
            );
        } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
            // Render video
            return (
                <video controls className="message-media">
                    <source src={file.url} type={`video/${fileExtension}`} />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            // Render link for other file types
            return (
                <div className="file-box">
                    <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <span className="file-name"> {file.name} </span>
                    </a>
                </div>
            );
        }
    };

    return (
        <div 
            className={`message ${user === message.author ? 'you' : 'other'}`} 
            /*onMouseEnter={onHover}
            onMouseLeave={onLeave}*/
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
            {message.file && renderMessageFile(message.file)}
        </div>
    )
}

export default Message;