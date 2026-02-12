import { ChatHelpers } from './ChatHelpers.js';

export class ChatTemplates {
    static getStatusIndicator(status) {
        if (!status) return '';
        const onlineClass = status.isOnline ? 'online' : '';
        return `<span class="status-indicator ${onlineClass}"></span>`;
    }

    static chatItemTemplate(conv, initials, displayName, displayTime, displayMessage, status) {
        return `
            <div class="avatar-container">
                <div class="initials-avatar">${initials}</div>
                ${ChatTemplates.getStatusIndicator(status)}
            </div>
            <div class="chat-info">
                <div class="chat-header">
                    <span class="chat-name">${displayName}</span>
                    <span class="chat-time">${displayTime}</span>
                </div>
                <div class="chat-footer">
                    <span class="chat-message">${displayMessage}</span>
                </div>
            </div>
        `;
    }

    static chatViewHeaderTemplate(initials, displayName, statusText, status) {
        return `
            <div class="chat-view-header">
                <i class="ri-arrow-left-line back-btn" id="back-to-chats"></i>
                <div class="avatar-container">
                    <div class="initials-avatar">${initials}</div>
                    ${ChatTemplates.getStatusIndicator(status)}
                </div>
                <div class="chat-view-info">
                    <h3>${displayName}</h3>
                    <span>${statusText}</span>
                </div>
                <div class="chat-view-actions">
                    <i class="ri-more-2-fill"></i>
                </div>
            </div>
        `;
    }

    static messageTemplate(msg, isSent, isGroup, senderName, currentUser, userService) {
        return `
            <div class="message ${isSent ? 'sent' : 'received'}">
                ${isGroup && !isSent ? `<span class="message-sender">${senderName}</span>` : ''}
                <p>${msg.text}</p>
                <span class="time">${ChatHelpers.formatTimestamp(msg.timestamp)}</span>
            </div>
        `;
    }

    static chatViewBodyTemplate(messages, isGroup, currentUser, userService) {
        if (messages.length === 0) {
            return '<div style="text-align:center; padding:2rem; color:#ccc;">Start the conversation!</div>';
        }
        return messages.map(msg => {
            const isSent = msg.sender === currentUser;
            const senderUser = isSent ? null : userService.getUser(msg.sender);
            const senderName = senderUser ? ChatHelpers.getUserDisplayName(senderUser) : msg.sender;
            return ChatTemplates.messageTemplate(msg, isSent, isGroup, senderName, currentUser, userService);
        }).join('');
    }

    static chatViewFooterTemplate() {
        return `
            <div class="chat-view-footer">
                <input type="text" id="message-input" placeholder="Type a message...">
                <div class="send-btn" id="send-btn">
                    <i class="ri-send-plane-fill"></i>
                </div>
            </div>
        `;
    }
}
