import { Chat } from '../models/Chat.js';
import { Group } from '../models/Group.js';
import { UserService } from './UserService.js';
import { Storage } from '../utils/Storage.js';
import { ChatHelpers } from '../utils/ChatHelpers.js';
import { ChatTemplates } from '../utils/ChatTemplates.js';

export class ChatService {
    constructor() {
        this.userService = new UserService();
        this.messagesKey = 'chat_messages';
        this.messages = this.loadMessages();
        this.groupsKey = 'chat_groups';
        this.groups = this.loadGroups();
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
            } else if (e.key === this.groupsKey) {
                this.groups = this.loadGroups();
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
    loadGroups() {
        return Storage.get(this.groupsKey) || [];
    }
    saveGroups() {
        Storage.set(this.groupsKey, this.groups);
    }
    getConversations() {
        if (!this.currentUser) return [];
        const conversations = {};
        const allUsers = this.userService.getUsers();
        allUsers.forEach(user => {
            if (user.username !== this.currentUser) {
                conversations[user.username] = {
                    ...user, name: user.username,
                    avatar: user.profilePicture || `https://i.pravatar.cc/150?u=${user.username.replaceAll(/\s/g, '')}`,
                    lastMessage: null, time: '', unread: 0, type: 'user'
                };
            }
        });
        this.groups.forEach(group => {
            conversations[group.name] = {
                ...group,
                avatar: group.avatar || `https://i.pravatar.cc/150?u=${group.name.replaceAll(/\s/g, '')}`,
                lastMessage: null, time: group.createdAt, unread: 0, type: 'group'
            };
        });
        this.messages.forEach(msg => {
            const isSender = msg.sender === this.currentUser;
            const isReceiver = msg.receiver === this.currentUser;
            if (isSender || isReceiver) {
                const contactName = isSender ? msg.receiver : msg.sender;
                if (conversations[contactName]?.type === 'user') {
                    conversations[contactName].lastMessage = msg;
                    conversations[contactName].time = msg.timestamp;
                }
            }
            if (conversations[msg.receiver]?.type === 'group') {
                 conversations[msg.receiver].lastMessage = msg;
                 conversations[msg.receiver].time = msg.timestamp;
            }
        });
        return Object.values(conversations).sort((a, b) => {
             const timeA = a.lastMessage ? a.lastMessage.id : (new Date(a.time).getTime() || 0);
             const timeB = b.lastMessage ? b.lastMessage.id : (new Date(b.time).getTime() || 0);
             return timeB - timeA;
        });
    }
    getMessages(contactName) {
        if (!this.currentUser) return [];
        
        // check if contactName is a group
        const isGroup = this.groups.some(g => g.name === contactName);

        if (isGroup) {
            return this.messages.filter(msg => msg.receiver === contactName);
        }

        return this.messages.filter(msg => 
            (msg.sender === contactName && msg.receiver === this.currentUser) || 
            (msg.sender === this.currentUser && msg.receiver === contactName)
        );
    }
    getUserStatus(username) {
        const user = this.userService.getUser(username);
        if (!user) return null;
        return {
            isOnline: user.isOnline,
            lastSeen: user.lastSeen
        };
    }
    renderChats(container, viewContainer, filterType = 'all', searchQuery = '') {
        if (!container) return;
        this.chatListContainer = container;
        this.chatViewContainer = viewContainer;
        this.currentFilter = filterType;
        this.currentSearchQuery = searchQuery;
        if (!this.currentUser) {
            container.innerHTML = '<div style="padding:1rem; text-align:center;">Please log in to see chats.</div>';
            return;
        }
        let conversations = this.getConversations();
        if (filterType === 'group') {
            conversations = conversations.filter(chat => chat.type === 'group');
        } else if (filterType === 'user') { 
             conversations = conversations.filter(chat => chat.type === 'user');
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            conversations = conversations.filter(conv => {
                const displayName = ChatHelpers.getUserDisplayName(conv).toLowerCase();
                return displayName.includes(query);
            });
        }
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
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.classList.add('mobile-view-active');
            }; 
            const displayName = ChatHelpers.getUserDisplayName(conv);
            const displayMessage = conv.lastMessage?.text || '<i>No messages yet</i>';
            const displayTime = ChatHelpers.formatTimestamp(conv.time) || '';
            const initials = ChatHelpers.getInitials(displayName);
            const status = conv.type === 'user' ? this.getUserStatus(conv.name) : null;
            chatItem.innerHTML = ChatTemplates.chatItemTemplate(conv, initials, displayName, displayTime, displayMessage, status);
            container.appendChild(chatItem);
        });
    }
    renderChatView(container, contactName) {
        if (!container || !this.currentUser) return;
        
        this.currentContact = contactName;
        const messages = this.getMessages(contactName);
        const contactUser = this.userService.getUser(contactName);
        const displayName = ChatHelpers.getUserDisplayName(contactUser || { username: contactName });
        const initials = ChatHelpers.getInitials(displayName);
        const status = this.getUserStatus(contactName);
        const statusText = status ? ChatHelpers.formatLastSeen(status.isOnline, status.lastSeen) : `@${contactName}`;
        const isGroup = this.groups.some(g => g.name === contactName);

        container.innerHTML = `
            ${ChatTemplates.chatViewHeaderTemplate(initials, displayName, statusText, status)}
            <div class="chat-view-body" id="chat-messages-body">
                ${ChatTemplates.chatViewBodyTemplate(messages, isGroup, this.currentUser, this.userService)}
            </div>
            ${ChatTemplates.chatViewFooterTemplate()}
        `;

        const body = container.querySelector('#chat-messages-body');
        if (body) body.scrollTop = body.scrollHeight;

        const backBtn = container.querySelector('#back-to-chats');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.classList.remove('mobile-view-active');
            });
        }

        const sendBtn = container.querySelector('#send-btn');
        const input = container.querySelector('#message-input');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;

            const newMessage = new Chat(Date.now(), text, new Date().toISOString(), this.currentUser, contactName);
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
    createGroup(name, members) {
        if (!name || !members || members.length === 0) return;
        
        const newGroup = new Group(
            Date.now(),
            name,
            members,
            this.currentUser,
            new Date().toISOString()
        );

        this.groups.push(newGroup);
        this.saveGroups();
        return newGroup;
    }

    handleUsernameChange(oldUsername, newUsername) {
        // 1. Update Groups
        let groupsChanged = false;
        this.groups = this.groups.map(group => {
            let updated = false;
            
            // Update members list
            if (group.members.includes(oldUsername)) {
                group.members = group.members.map(m => m === oldUsername ? newUsername : m);
                updated = true;
            }
            
            // Update admin if applicable
            if (group.admin === oldUsername) {
                group.admin = newUsername;
                updated = true;
            }
            
            if (updated) groupsChanged = true;
            return group;
        });
        
        if (groupsChanged) this.saveGroups();

        // 2. Update Messages
        let messagesChanged = false;
        this.messages = this.messages.map(msg => {
            let updated = false;
            
            if (msg.sender === oldUsername) {
                msg.sender = newUsername;
                updated = true;
            }
            
            if (msg.receiver === oldUsername) {
                msg.receiver = newUsername;
                updated = true;
            }
            
            if (updated) messagesChanged = true;
            return msg;
        });
        
        if (messagesChanged) this.saveMessages();
        
        // 3. Update Current User if applicable
        if (this.currentUser === oldUsername) {
            this.currentUser = newUsername;
        }
    }
}
