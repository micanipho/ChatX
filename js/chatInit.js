import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';

/**
 * Initializes chat page functionality
 * @param {AuthService} authService - The authentication service instance
 * @param {ChatService} chatService - The chat service instance
 */
export function initChatPage(authService, chatService) {
    const chatListContainer = document.querySelector('.chat-list');
    const chatViewContainer = document.querySelector('.chat-view');
    
    if (!chatListContainer || !chatViewContainer) {
        return; 
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    // Ensure user is marked as online when they land on the chat page
    authService.updateStatus(currentUser.username, true);
    
    chatService.setCurrentUser(currentUser);
    chatService.renderChats(chatListContainer, chatViewContainer);

    // Handle URL parameters for pre-selected contact/group
    const urlParams = new URLSearchParams(globalThis.location.search);
    const contactParam = urlParams.get('contact');
    if (contactParam) {
        chatService.renderChatView(chatViewContainer, contactParam);
        
        // Toggle Mobile View if pre-selected
        const mainElement = document.querySelector('main');
        if (mainElement) mainElement.classList.add('mobile-view-active');
    }

    // Tab filtering functionality
    const allChatsTab = document.querySelector('.tab-all');
    const groupsTab = document.querySelector('.tab-groups');

    const switchTab = (type) => {
        const chatSearchInput = document.getElementById('chat-search-input');
        const searchQuery = chatSearchInput?.value || '';
        
        if (type === 'all') {
            allChatsTab?.classList.add('active');
            groupsTab?.classList.remove('active');
            chatService.renderChats(chatListContainer, chatViewContainer, 'all', searchQuery);
        } else {
            allChatsTab?.classList.remove('active');
            groupsTab?.classList.add('active');
            chatService.renderChats(chatListContainer, chatViewContainer, 'group', searchQuery);
        }
    };

    allChatsTab?.addEventListener('click', () => switchTab('all'));
    groupsTab?.addEventListener('click', () => switchTab('group'));

    // Search functionality
    const chatSearchInput = document.getElementById('chat-search-input');
    chatSearchInput?.addEventListener('input', (e) => {
        const searchQuery = e.target.value;
        const currentFilter = chatService.currentFilter || 'all';
        chatService.renderChats(chatListContainer, chatViewContainer, currentFilter, searchQuery);
    });
}
