import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { Storage } from './utils/Storage.js';
import { Notification } from './utils/Notification.js';
import { ChatHelpers } from './utils/ChatHelpers.js';

/**
 * Calculate user initials from user data
 * @param {Object} user - User object containing name information
 * @returns {string} User initials
 */
function calculateInitials(user) {
    const { firstName, lastName, fName, lName, username } = user;
    
    if (firstName && lastName) return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    if (fName && lName) return (fName.charAt(0) + lName.charAt(0)).toUpperCase();
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (username) return username.slice(0, 2).toUpperCase();
    return '';
}

/**
 * Update profile display elements
 * @param {Object} user - User object
 * @param {string} initials - User initials
 */
function updateProfileDisplay(user, initials) {
    const { firstName, lastName, fName, lName, username } = user;
    const profileName = document.getElementById('profile-name');
    const profileUsername = document.getElementById('profile-username');
    const profileImgAvatar = document.getElementById('profile-img-avatar');
    const profileInitialsAvatar = document.getElementById('profile-initials-avatar');

    if (profileName) profileName.textContent = `${firstName || fName || ''} ${lastName || lName || ''}`.trim() || username;
    if (profileUsername) profileUsername.textContent = `@${username}`;

    // Force Initials on Profile Header
    if (profileImgAvatar) profileImgAvatar.classList.add('hidden');
    if (profileInitialsAvatar) {
        profileInitialsAvatar.textContent = initials;
        profileInitialsAvatar.classList.remove('hidden');
        profileInitialsAvatar.className = 'profile-initials-avatar';
    }
}

/**
 * Render groups list
 * @param {ChatService} chatService - Chat service instance
 * @param {string} username - Current username
 */
function renderGroups(chatService, username) {
    const groupsList = document.getElementById('groups-list');
    if (!groupsList) return;

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

/**
 * Validate password change inputs
 * @param {string} currentPassword - Current password input
 * @param {string} newPassword - New password input
 * @param {string} confirmPassword - Confirm password input
 * @param {Object} user - Current user object
 * @returns {Object|null} Error object with message, or null if valid
 */
function validatePasswordChange(currentPassword, newPassword, confirmPassword, user) {
    if (!currentPassword || !newPassword || !confirmPassword) {
        return { message: 'All fields are required' };
    }

    if (currentPassword !== user.password) {
        return { message: 'Current password is incorrect' };
    }

    if (newPassword !== confirmPassword) {
        return { message: 'New passwords do not match' };
    }

    if (newPassword.length < 6) {
        return { message: 'New password must be at least 6 characters' };
    }

    return null;
}

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
    
    const { username } = user;
    const initials = calculateInitials(user);
    
    updateProfileDisplay(user, initials);
    renderGroups(chatService, username);

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

        const validationError = validatePasswordChange(currentPassword, newPassword, confirmPassword, user);
        if (validationError) {
            Notification.error(validationError.message);
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
