import React from 'react';
import '../index.css';

const Notification = ({ message, type }) => {
    if (!message) {
        return null;
    }
    const notifStyle = type === 'success' ? 'success' : 'error';
    return (
        <div className={notifStyle}>
            {message}
        </div>
    )
}

export default Notification;