import { Chat } from '../models/Chat.js';
import { UserService } from './UserService.js';
import { Storage } from '../utils/Storage.js';

export class ChatService {
    constructor() {
        this.userService = new UserService();
        this.messagesKey = 'chat_messages';
        this.messages = this.loadMessages();
        this.currentUser = null;
        this.chatListContainer = null;
        this.chatViewContainer = null;
        this.currentContact = null;

        this.bindStorageListener();
    }

    bindStorageListener() {
        globalThis.addEventListener('storage', (e) => {
            if (e.key === this.messagesKey) {
                this.messages = this.loadMessages(); 
                this.updateUI();
            } else if (e.key === 'userData') {
                this.userService.refreshUsers(); 
                this.updateUI();
            }
        });
    }

    updateUI() {
        if (this.chatListContainer && this.chatViewContainer) {
            this.renderChats(this.chatListContainer, this.chatViewContainer);
        }
        
        if (this.currentContact && this.chatViewContainer) {
            this.renderChatView(this.chatViewContainer, this.currentContact);
        }
    }

    setCurrentUser(user) {
        if (user) this.currentUser = user.username;
    }

    loadMessages() {
        return Storage.get(this.messagesKey) || [];
    }

    saveMessages() {
        Storage.set(this.messagesKey, this.messages);
    }

    getConversations() {
        if (!this.currentUser) return [];

        const conversations = {};
        const allUsers = this.userService.getUsers();

        allUsers.forEach(user => {
            if (user.username !== this.currentUser) {
                conversations[user.username] = {
                    ...user,
                    name: user.username,
                    avatar: user.profilePicture || `https://i.pravatar.cc/150?u=${user.username.replace(/\s/g, '')}`,
                    lastMessage: null,
                    time: '',
                    unread: 0
                };
            }
        });

        this.messages.forEach(msg => {
            const isSender = msg.sender === this.currentUser;
            const isReceiver = msg.receiver === this.currentUser;

            if (isSender || isReceiver) {
                const contactName = isSender ? msg.receiver : msg.sender;
                
                if (conversations[contactName]) {
                    conversations[contactName].lastMessage = msg;
                    conversations[contactName].time = msg.timestamp;
                }
            }
        });

        return Object.values(conversations).sort((a, b) => {
             if (a.lastMessage && b.lastMessage) return b.lastMessage.id - a.lastMessage.id;
             if (a.lastMessage) return -1;
             if (b.lastMessage) return 1;
             return 0;
        });
    }

    getMessages(contactName) {
        if (!this.currentUser) return [];
        return this.messages.filter(msg => 
            (msg.sender === contactName && msg.receiver === this.currentUser) || 
            (msg.sender === this.currentUser && msg.receiver === contactName)
        );
    }

    getUserDisplayName(user) {
        if (!user) return 'Unknown User';
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.fName && user.lName) return `${user.fName} ${user.lName}`; 
        return user.firstName || user.name || user.username;
    }

    renderChats(container, viewContainer) {
        if (!container) return;
        
        this.chatListContainer = container;
        this.chatViewContainer = viewContainer;

        if (!this.currentUser) {
            container.innerHTML = '<div style="padding:1rem; text-align:center;">Please log in to see chats.</div>';
            return;
        }

        const conversations = this.getConversations();
        container.innerHTML = ''; 
        
        if (conversations.length === 0) {
            container.innerHTML = '<div style="padding:1rem; text-align:center; color:#999;">No other users found.</div>';
            return;
        }

        conversations.forEach(conv => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item ${this.currentContact === conv.name ? 'active' : ''}`;
            
            chatItem.onclick = () => {
                this.renderChatView(viewContainer, conv.name);
                document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
                chatItem.classList.add('active');
            }; 

            const displayName = this.getUserDisplayName(conv);
            const displayMessage = conv.lastMessage?.text || '<i>No messages yet</i>';
            const displayTime = conv.time || '';

            chatItem.innerHTML = `
                <img src="${conv.avatar}" alt="${displayName}" class="chat-avatar">
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
            container.appendChild(chatItem);
        });
    }

    renderChatView(container, contactName) {
        if (!container || !this.currentUser) return;
        
        this.currentContact = contactName;
        const messages = this.getMessages(contactName);
        const contactUser = this.userService.getUser(contactName);
        const displayName = this.getUserDisplayName(contactUser || { username: contactName });
        const avatar = contactUser?.profilePicture || `https://i.pravatar.cc/150?u=${contactName.replace(/\s/g, '')}`;

        container.innerHTML = `
            <div class="chat-view-header">
                <img src="${avatar}" alt="${displayName}" class="chat-view-avatar">
                <div class="chat-view-info">
                    <h3>${displayName}</h3>
                    <span>@${contactName}</span>
                </div>
                <div class="chat-view-actions">
                    <i class="ri-more-2-fill"></i>
                </div>
            </div>
            <div class="chat-view-body" id="chat-messages-body">
                ${messages.length > 0 ? messages.map(msg => `
                    <div class="message ${msg.sender === this.currentUser ? 'sent' : 'received'}">
                        <p>${msg.text}</p>
                        <span class="time">${msg.timestamp}</span>
                    </div>
                `).join('') : '<div style="text-align:center; padding:2rem; color:#ccc;">Start the conversation!</div>'}
            </div>
            <div class="chat-view-footer">
                <input type="text" id="message-input" placeholder="Type a message...">
                <div class="send-btn" id="send-btn">
                    <i class="ri-send-plane-fill"></i>
                </div>
            </div>
        `;

        const body = container.querySelector('#chat-messages-body');
        if (body) body.scrollTop = body.scrollHeight;

        const sendBtn = container.querySelector('#send-btn');
        const input = container.querySelector('#message-input');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;

            const newMessage = new Chat(
                Date.now(), 
                text, 
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                this.currentUser, 
                contactName
            );
            
            this.messages.push(newMessage);
            this.saveMessages();
            
            this.renderChatView(container, contactName); 
            if (this.chatListContainer) {
                this.renderChats(this.chatListContainer, container);
            }
            
            const newInput = container.querySelector('#message-input');
            if (newInput) newInput.focus();
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}
