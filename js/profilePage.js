import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { Storage } from './utils/Storage.js';
import { Notification } from './utils/Notification.js';
import { ChatHelpers } from './utils/ChatHelpers.js';

/**
 * Initializes the profile page functionality
 * @param {AuthService} authService - The authentication service instance
 * @param {ChatService} chatService - The chat service instance
 */
export function initProfilePage(authService, chatService) {
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const profileImgAvatar = document.getElementById('profile-img-avatar');
    const profileInitialsAvatar = document.getElementById('profile-initials-avatar');

    if (!profileName && !profileUsername && !profileImgAvatar && !profileInitialsAvatar) {
        return; // Not on profile page
    }

    const user = authService.getCurrentUser();
    if (!user) return;

    // Ensure user is marked as online when they visit their profile
    authService.updateStatus(user.username, true);
    
    const { firstName, lastName, fName, lName, username } = user;
    let initials = '';
    
    if (firstName && lastName) initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    else if (fName && lName) initials = (fName.charAt(0) + lName.charAt(0)).toUpperCase();
    else if (firstName) initials = firstName.charAt(0).toUpperCase();
    else if (username) initials = username.slice(0, 2).toUpperCase();

    if (profileName) profileName.textContent = `${firstName || fName || ''} ${lastName || lName || ''}`.trim() || username;
    if (profileUsername) profileUsername.textContent = `@${username}`;

    // Force Initials on Profile Header
    if (profileImgAvatar) profileImgAvatar.classList.add('hidden');
    if (profileInitialsAvatar) {
        profileInitialsAvatar.textContent = initials;
        profileInitialsAvatar.classList.remove('hidden');
        profileInitialsAvatar.className = 'profile-initials-avatar';
    }

    // Load and display groups
    const groupsList = document.getElementById('groups-list');
    if (groupsList) {
        const groups = chatService?.groups?.filter(group => 
            group.members?.includes(username)
        ) || [];

        if (groups.length > 0) {
            groupsList.innerHTML = groups.map(group => `
                <div class="group-item" style="cursor: pointer;" onclick="globalThis.location.href='../pages/chat.html?contact=${encodeURIComponent(group.name)}'">
                    <div class="group-avatar">${group.name.charAt(0).toUpperCase()}</div>
                    <div class="group-details">
                        <p class="group-name">${group.name}</p>
                        <p class="group-members">${group.members.length} members</p>
                    </div>
                </div>
            `).join('');
        } else {
            groupsList.innerHTML = '<p class="placeholder-text">You are not part of any groups yet.</p>';
        }
    }

    // Online Users Logic
    const onlineUsersList = document.getElementById('online-users-list');
    
    const renderOnlineUsers = () => {
        if (!onlineUsersList) return;
        
        const users = chatService.userService.getUsers();
        const onlineUsers = users.filter(u => u.username !== username && u.isOnline);

        if (onlineUsers.length > 0) {
            onlineUsersList.innerHTML = onlineUsers.map(u => {
                const displayName = ChatHelpers.getUserDisplayName(u);
                const initials = ChatHelpers.getInitials(displayName);

                return `
                    <div class="user-item" onclick="globalThis.location.href='../pages/chat.html?contact=${encodeURIComponent(u.username)}'">
                        <div class="user-avatar-wrapper">
                            <div class="user-avatar-initials">${initials}</div>
                            <div class="user-status-dot"></div>
                        </div>
                        <div class="user-info-text">
                            <p class="user-info-name">${displayName}</p>
                            <p class="user-info-status">Online</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            onlineUsersList.innerHTML = '<p class="placeholder-text">No users are currently online.</p>';
        }
    };

    renderOnlineUsers();

    // Listen for status changes across tabs
    globalThis.addEventListener('storage', (e) => {
        if (e.key === 'userData') {
            chatService.userService.refreshUsers();
            renderOnlineUsers();
        }
    });

    // Modal Toggle Functions
    const updateProfileModal = document.getElementById('update-profile-modal');
    const changePasswordModal = document.getElementById('change-password-modal');

    const showModal = (modal) => {
        if (modal) modal.classList.remove('hidden');
    };

    const hideModal = (modal) => {
        if (modal) modal.classList.add('hidden');
    };

    // Update Profile Modal
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const closeUpdateModal = document.getElementById('close-update-modal');
    const cancelUpdateBtn = document.getElementById('cancel-update-btn');

    updateProfileBtn?.addEventListener('click', () => {
        showModal(updateProfileModal);
        
        const profileUsernameInput = document.getElementById('profile-username-input');
        if (profileUsernameInput) profileUsernameInput.value = username || '';
    });

    closeUpdateModal?.addEventListener('click', () => hideModal(updateProfileModal));
    cancelUpdateBtn?.addEventListener('click', () => hideModal(updateProfileModal));

    // Save Profile Button Logic
    const saveProfileBtn = document.getElementById('save-profile-btn');
    saveProfileBtn?.addEventListener('click', () => {
        const profileUsernameInput = document.getElementById('profile-username-input');
        const updatedUsername = profileUsernameInput?.value.trim() || '';

        if (!updatedUsername) {
            Notification.error('Username cannot be empty');
            return;
        }

        const updatedUser = chatService.userService.updateUser(username, { username: updatedUsername });

        if (updatedUser) {
            if (updatedUsername !== username) {
                chatService.handleUsernameChange(username, updatedUsername);
            }
            
            Storage.setSession('loggedInUser', updatedUser);
            hideModal(updateProfileModal);
            Notification.success('Profile updated successfully!');
            globalThis.location.reload();
        }
    });

    // Change Password Modal
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closePasswordModal = document.getElementById('close-password-modal');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');

    changePasswordBtn?.addEventListener('click', () => showModal(changePasswordModal));
    closePasswordModal?.addEventListener('click', () => hideModal(changePasswordModal));
    cancelPasswordBtn?.addEventListener('click', () => hideModal(changePasswordModal));

    // Save Password Button Logic
    const savePasswordBtn = document.getElementById('save-password-btn');
    savePasswordBtn?.addEventListener('click', async () => {
        const currentPasswordInput = document.getElementById('current-password-input');
        const newPasswordInput = document.getElementById('new-password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');

        const currentPassword = currentPasswordInput?.value.trim() || '';
        const newPassword = newPasswordInput?.value.trim() || '';
        const confirmPassword = confirmPasswordInput?.value.trim() || '';

        if (!currentPassword || !newPassword || !confirmPassword) {
            Notification.error('All fields are required');
            return;
        }

        if (currentPassword !== user.password) {
            Notification.error('Current password is incorrect');
            return;
        }

        if (newPassword !== confirmPassword) {
            Notification.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Notification.error('New password must be at least 6 characters');
            return;
        }

        try {
            const success = await authService.resetPassword(username, newPassword);

            if (success) {
                const updatedUser = authService.getCurrentUser();
                Storage.setSession('loggedInUser', updatedUser);
                
                if (currentPasswordInput) currentPasswordInput.value = '';
                if (newPasswordInput) newPasswordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';

                hideModal(changePasswordModal);
                Notification.success('Password changed successfully!');
            }
        } catch (error) {
            Notification.error(error.message);
        }
    });

    // Back Button Logic
    const backProfileBtn = document.getElementById('back-profile-btn');
    backProfileBtn?.addEventListener('click', () => {
        globalThis.location.href = './chat.html';
    });
}
