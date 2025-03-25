import React from 'react';
import './NewDayLine.css';

const NewDayLine = ({ currentMessageDate, previousMessageDate }) => {
    const isNewDay = previousMessageDate && 
                    (currentMessageDate.getDate() !== previousMessageDate.getDate() ||
                    currentMessageDate.getMonth() !== previousMessageDate.getMonth() ||
                    currentMessageDate.getFullYear() !== previousMessageDate.getFullYear());

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formattedMessageDate = formatDate(currentMessageDate);

    if (!isNewDay) return null;

    return (
        <div className="new-day-line">
            <span className="line-date">{formattedMessageDate}</span>
        </div>
    )
}

export default NewDayLine;