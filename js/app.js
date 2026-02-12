import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { Storage } from './utils/Storage.js';

const authService = new AuthService();
const chatService = new ChatService();

const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav_links');

menuBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    const isExpanded = navLinks?.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
});

const navLinkItems = navLinks?.querySelectorAll('a');
navLinkItems?.forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
    });
});

// App Logic
const startChatBtn = document.getElementById('start_chat_btn');
const signupForm = document.getElementById('signup_form');
const loginForm = document.getElementById('login_form');
const errorBox = document.getElementsByClassName('errorBox')[0];
const logoutBtn = document.getElementById('logout-btn');


startChatBtn?.addEventListener('click', () => {
    globalThis.location.href = 'pages/sign-up.html';
});

const handleAuth = (form, action, redirect) => {
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const result = action(data);
            if (redirect) globalThis.location.href = redirect;
            if (result) {
                console.log('Logged in user:', result);
                chatService.setCurrentUser(result);
                chatService.renderChats(chatListContainer, chatViewContainer);
            }
            form.reset();
        } catch (error) {
            console.log(error.message);
            errorBox.textContent = error.message;
        }
    });
};

handleAuth(signupForm, (data) => authService.register(data), './log-in.html');
handleAuth(loginForm, (data) => authService.login(data.username, data.password), './chat.html');

// Forgot Password Logic
const forgotPasswordForm = document.getElementById('forgot_password_form');
if (forgotPasswordForm) {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const verifyUsernameBtn = document.getElementById('verify-username-btn');
    const verifyAnswerBtn = document.getElementById('verify-answer-btn');
    const displayQuestion = document.getElementById('display-question');
    
    let currentUsername = '';

    verifyUsernameBtn?.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            errorBox.textContent = 'Please enter a username.';
            return;
        }

        try {
            const question = authService.getSecurityQuestion(username);
            currentUsername = username;
            displayQuestion.textContent = question;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            errorBox.textContent = '';
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });

    verifyAnswerBtn?.addEventListener('click', () => {
        const answer = document.getElementById('securityAnswer').value.trim();
        if (!answer) {
            errorBox.textContent = 'Please provide an answer.';
            return;
        }

        try {
            authService.verifySecurityAnswer(currentUsername, answer);
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            errorBox.textContent = '';
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            errorBox.textContent = 'Passwords do not match.';
            return;
        }

        try {
            authService.resetPassword(currentUsername, newPassword);
            alert('Password reset successfully! Please login with your new password.');
            globalThis.location.href = './log-in.html';
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });
}


const profileCircle = document.getElementById('profile-circle');
if (profileCircle) {
    const user = authService.getCurrentUser();
    if (user) {
        const { firstName, lastName, fName, lName, username, profilePicture } = user;
        let initials = '';
        
        if (firstName && lastName) initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        else if (fName && lName) initials = (fName.charAt(0) + lName.charAt(0)).toUpperCase();
        else if (firstName) initials = firstName.charAt(0).toUpperCase();
        else if (username) initials = username.slice(0, 2).toUpperCase();
        
        // Sidebar Initials
        profileCircle.textContent = initials;
    }
}

// Profile Page Logic (independent of chat page)
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileImgAvatar = document.getElementById('profile-img-avatar');
const profileInitialsAvatar = document.getElementById('profile-initials-avatar');

if (profileName || profileUsername || profileImgAvatar || profileInitialsAvatar) {
    const user = authService.getCurrentUser();
    if (user) {
        const { firstName, lastName, fName, lName, username, profilePicture } = user;
        let initials = '';
        
        if (firstName && lastName) initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        else if (fName && lName) initials = (fName.charAt(0) + lName.charAt(0)).toUpperCase();
        else if (firstName) initials = firstName.charAt(0).toUpperCase();
        else if (username) initials = username.slice(0, 2).toUpperCase();

        if (profileName) profileName.textContent = `${firstName || fName || ''} ${lastName || lName || ''}`.trim() || username;
        if (profileUsername) profileUsername.textContent = `@${username}`;

        // Display avatar or initials
        if (profilePicture) {
             if (profileImgAvatar) {
                profileImgAvatar.src = profilePicture;
                profileImgAvatar.classList.remove('hidden');
                if (profileInitialsAvatar) profileInitialsAvatar.classList.add('hidden');
            }
        } else if (profileInitialsAvatar) {
            profileInitialsAvatar.textContent = initials;
            profileInitialsAvatar.classList.remove('hidden');
            if (profileImgAvatar) profileImgAvatar.classList.add('hidden');
        }

        // Load and display groups
        const groupsList = document.getElementById('groups-list');
        if (groupsList) {
            // Ensure chatService groups are loaded
            const groups = (chatService && chatService.groups) ? chatService.groups.filter(group => 
                group.members && group.members.includes(username)
            ) : [];

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
// ... [Modal Toggle and other profile logic follows]

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
            
            // Populate username field only
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
                alert('Username cannot be empty');
                return;
            }

            // Update user data with only username change
            const updatedUser = {
                ...user,
                username: updatedUsername
            };

            // Save to session and local storage
            const users = Storage.get('userData') || {};
            
            // If username changed, remove old entry and add new one
            if (updatedUsername !== username) {
                delete users[username];
            }
            
            users[updatedUsername] = updatedUser;
            Storage.set('userData', users);
            Storage.setSession('loggedInUser', updatedUser);

            hideModal(updateProfileModal);
            alert('Profile updated successfully!');
            globalThis.location.reload();
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
        savePasswordBtn?.addEventListener('click', () => {
            const currentPasswordInput = document.getElementById('current-password-input');
            const newPasswordInput = document.getElementById('new-password-input');
            const confirmPasswordInput = document.getElementById('confirm-password-input');

            const currentPassword = currentPasswordInput?.value.trim() || '';
            const newPassword = newPasswordInput?.value.trim() || '';
            const confirmPassword = confirmPasswordInput?.value.trim() || '';

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('All fields are required');
                return;
            }

            if (currentPassword !== user.password) {
                alert('Current password is incorrect');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            if (newPassword.length < 6) {
                alert('New password must be at least 6 characters');
                return;
            }

            // Update password
            const updatedUser = {
                ...user,
                password: newPassword
            };

            const users = Storage.get('userData') || {};
            users[username] = updatedUser;
            Storage.set('userData', users);
            Storage.setSession('loggedInUser', updatedUser);

            // Clear form
            if (currentPasswordInput) currentPasswordInput.value = '';
            if (newPasswordInput) newPasswordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';

            hideModal(changePasswordModal);
            alert('Password changed successfully!');
        });

        // Back Button Logic
        const backProfileBtn = document.getElementById('back-profile-btn');
        backProfileBtn?.addEventListener('click', () => {
            globalThis.location.href = './chat.html';
        });
    }
}




// Logout Modal Logic
const logoutModal = document.getElementById('logout-modal');
const closeLogoutModalBtn = document.getElementById('close-logout-modal-btn');
const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
const confirmLogoutBtn = document.getElementById('confirm-logout-btn');

const showLogoutModal = () => {
    if (logoutModal) {
        logoutModal.classList.remove('hidden');
    }
};

const hideLogoutModal = () => {
    if (logoutModal) {
        logoutModal.classList.add('hidden');
    }
};

// Show logout modal when logout button is clicked
logoutBtn?.addEventListener('click', () => {
    showLogoutModal();
});

// Hide modal when close button is clicked
closeLogoutModalBtn?.addEventListener('click', hideLogoutModal);
cancelLogoutBtn?.addEventListener('click', hideLogoutModal);

// Confirm logout
confirmLogoutBtn?.addEventListener('click', () => {
    authService.logout();
    hideLogoutModal();
    globalThis.location.href = './log-in.html';
});

// Chat Logic

const chatListContainer = document.querySelector('.chat-list');
const chatViewContainer = document.querySelector('.chat-view');
if (chatListContainer && chatViewContainer) {
    const currentUser = authService.getCurrentUser();
    if(currentUser) {
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
    }
}

// Group Chat Logic
const createGroupBtn = document.getElementById('chat-btn');
const createGroupModal = document.getElementById('create-group-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelGroupBtn = document.getElementById('cancel-group-btn');
const confirmCreateGroupBtn = document.getElementById('confirm-create-group-btn');
const groupNameInput = document.getElementById('group-name');
const userSelectionList = document.getElementById('user-selection-list');

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

// Mobile action buttons (duplicates of sidebar buttons for mobile view)
const createGroupBtnMobile = document.getElementById('chat-btn-mobile');
const logoutBtnMobile = document.getElementById('logout-btn-mobile');
const profileCircleMobile = document.getElementById('profile-circle-mobile');

// Wire up mobile buttons to same functionality as sidebar buttons
createGroupBtnMobile?.addEventListener('click', () => toggleModal(true));
logoutBtnMobile?.addEventListener('click', () => {
    showLogoutModal();
});

// Populate mobile profile circle with initials
if (profileCircleMobile) {
    const user = authService.getCurrentUser();
    if (user) {
        const { firstName, lastName, fName, lName, username } = user;
        let initials = '';
        
        if (firstName && lastName) initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        else if (fName && lName) initials = (fName.charAt(0) + lName.charAt(0)).toUpperCase();
        else if (firstName) initials = firstName.charAt(0).toUpperCase();
        else if (username) initials = username.slice(0, 2).toUpperCase();
        
        profileCircleMobile.textContent = initials;
    }
}


// ---- Chat Filtering Logic ----
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

// ---- Chat Search Logic ----
const chatSearchInput = document.getElementById('chat-search-input');

chatSearchInput?.addEventListener('input', (e) => {
    const searchQuery = e.target.value;
    const currentFilter = chatService.currentFilter || 'all';
    chatService.renderChats(chatListContainer, chatViewContainer, currentFilter, searchQuery);
});


const populateUserSelection = () => {
    if (!userSelectionList) return;
    userSelectionList.innerHTML = '';
    
    const currentUser = authService.getCurrentUser();

    const users = chatService.userService.getUsers();
    
    users.forEach(user => {
        if (user.username === currentUser?.username) return; 
        console.log('Processing user for group add:', user); 

        const item = document.createElement('div');
        item.className = 'group-member-item';
        item.onclick = (e) => {
            // Toggle checkbox when clicking row (unless clicking checkbox directly)
            if (e.target.type !== 'checkbox') {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) item.classList.add('selected');
                else item.classList.remove('selected');
            }
        };

        const avatar = user.profilePicture || `https://i.pravatar.cc/150?u=${user.username.replaceAll(' ', '')}`;
        const displayName = chatService.getUserDisplayName(user);

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
        
        // Add change listener to verify specific class toggling
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
             if (checkbox.checked) item.classList.add('selected');
             else item.classList.remove('selected');
        });

        userSelectionList.appendChild(item);
    });

    if (users.length <= 1) { // Only current user exists
        userSelectionList.innerHTML = '<div style="padding:1rem; text-align:center; color:#999;">No other users available to add.</div>';
    }
};

confirmCreateGroupBtn?.addEventListener('click', () => {
    const groupName = groupNameInput?.value.trim();
    if (!groupName) {
        alert('Please enter a group name');
        return;
    }

    const selectedCheckboxes = userSelectionList?.querySelectorAll('input[type="checkbox"]:checked');
    const selectedMembers = Array.from(selectedCheckboxes || []).map(cb => cb.value);

    // Add current user to members
    const currentUser = authService.getCurrentUser();
    if (currentUser) selectedMembers.push(currentUser.username);
    
    // Allow groups with just the creator (or check if members > 1 if required)
    // if (selectedMembers.length < 2) { ... }

    chatService.createGroup(groupName, selectedMembers);
    toggleModal(false);
    
    // Refresh chat list
    chatService.renderChats(chatListContainer, chatViewContainer);
});
