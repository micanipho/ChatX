import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';

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

        // Profile Page Logic
        const profileName = document.getElementById('profile-name');
        const profileUsername = document.getElementById('profile-username');
        const profileImgLarge = document.getElementById('profile-img-large');
        const profileInitialsLarge = document.getElementById('profile-initials-large');

        if (profileName) profileName.textContent = `${firstName || fName || ''} ${lastName || lName || ''}`.trim() || username;
        if (profileUsername) profileUsername.textContent = `@${username}`;

        if (profilePicture) {
             if (profileImgLarge) {
                profileImgLarge.src = profilePicture;
                profileImgLarge.classList.remove('hidden');
                if (profileInitialsLarge) profileInitialsLarge.classList.add('hidden');
            }
        } else if (profileInitialsLarge) {
            profileInitialsLarge.textContent = initials;
            profileInitialsLarge.classList.remove('hidden');
            if (profileImgLarge) profileImgLarge.classList.add('hidden');
        }
    }
}


logoutBtn?.addEventListener('click', () => {
    authService.logout();
    alert('You have been logged out successfully');
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
            // Reset form
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
    authService.logout();
    alert('You have been logged out successfully');
    globalThis.location.href = './log-in.html';
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
        if (user.username === currentUser?.username) return; // Skip current user
        console.log('Processing user for group add:', user); // Debug: Check user properties

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
