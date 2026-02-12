import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { Notification } from './utils/Notification.js';
import { ChatHelpers } from './utils/ChatHelpers.js';

/**
 * Initializes group chat functionality
 * @param {AuthService} authService - The authentication service instance
 * @param {ChatService} chatService - The chat service instance
 * @param {Function} showLogoutModal - Function to show the logout modal
 */
export function initGroupChat(authService, chatService, showLogoutModal) {
    const createGroupBtn = document.getElementById('chat-btn');
    const createGroupModal = document.getElementById('create-group-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelGroupBtn = document.getElementById('cancel-group-btn');
    const confirmCreateGroupBtn = document.getElementById('confirm-create-group-btn');
    const groupNameInput = document.getElementById('group-name');
    const userSelectionList = document.getElementById('user-selection-list');
    const chatListContainer = document.querySelector('.chat-list');
    const chatViewContainer = document.querySelector('.chat-view');

    const toggleModal = (show) => {
        if (createGroupModal) {
            if (show) {
                createGroupModal.classList.remove('hidden');
                populateUserSelection();
            } else {
                createGroupModal.classList.add('hidden');
                
                if (groupNameInput) groupNameInput.value = '';
                if (userSelectionList) userSelectionList.innerHTML = '';
            }
        }
    };

    createGroupBtn?.addEventListener('click', () => toggleModal(true));
    closeModalBtn?.addEventListener('click', () => toggleModal(false));
    cancelGroupBtn?.addEventListener('click', () => toggleModal(false));

    // Mobile action buttons
    const createGroupBtnMobile = document.getElementById('chat-btn-mobile');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');

    createGroupBtnMobile?.addEventListener('click', () => toggleModal(true));
    logoutBtnMobile?.addEventListener('click', () => {
        if (showLogoutModal) showLogoutModal();
    });

    const populateUserSelection = () => {
        if (!userSelectionList) return;
        userSelectionList.innerHTML = '';
        
        const currentUser = authService.getCurrentUser();
        const users = chatService.userService.getUsers();
        
        users.forEach(user => {
            if (user.username === currentUser?.username) return;

            const item = document.createElement('div');
            item.className = 'group-member-item';
            item.onclick = (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    if (checkbox.checked) item.classList.add('selected');
                    else item.classList.remove('selected');
                }
            };

            const avatar = user.profilePicture || `https://i.pravatar.cc/150?u=${user.username.replaceAll(' ', '')}`;
            const displayName = ChatHelpers.getUserDisplayName(user);

            item.innerHTML = `
                <img src="${avatar}" alt="${displayName}" class="group-member-avatar">
                <div class="group-member-info">
                    <div class="group-member-header">
                        <span class="group-member-name">${displayName}</span>
                    </div>
                    <div class="group-member-footer">
                        <span class="group-member-status">@${user.username}</span>
                    </div>
                </div>
                <input type="checkbox" class="group-member-checkbox" value="${user.username}">
            `;
            
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                 if (checkbox.checked) item.classList.add('selected');
                 else item.classList.remove('selected');
            });

            userSelectionList.appendChild(item);
        });

        if (users.length <= 1) {
            userSelectionList.innerHTML = '<div style="padding:1rem; text-align:center; color:#999;">No other users available to add.</div>';
        }
    };

    confirmCreateGroupBtn?.addEventListener('click', () => {
        const groupName = groupNameInput?.value.trim();
        if (!groupName) {
            Notification.error('Please enter a group name');
            return;
        }

        const selectedCheckboxes = userSelectionList?.querySelectorAll('input[type="checkbox"]:checked');
        const selectedMembers = Array.from(selectedCheckboxes || []).map(cb => cb.value);

        const currentUser = authService.getCurrentUser();
        if (currentUser) selectedMembers.push(currentUser.username);

        chatService.createGroup(groupName, selectedMembers);
        toggleModal(false);
        
        if (chatListContainer && chatViewContainer) {
            chatService.renderChats(chatListContainer, chatViewContainer);
        }
    });
}
