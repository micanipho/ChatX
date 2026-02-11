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
    window.location.href = 'pages/sign-up.html';
});

const handleAuth = (form, action, redirect) => {
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const result = action(data);
            if (redirect) window.location.href = redirect;
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
        } else {
             if (profileInitialsLarge) {
                profileInitialsLarge.textContent = initials;
                profileInitialsLarge.classList.remove('hidden');
                if (profileImgLarge) profileImgLarge.classList.add('hidden');
            }
        }
    }
}


logoutBtn?.addEventListener('click', () => {
    authService.logout();
    alert('You have been logged out successfully');
    window.location.href = './log-in.html';
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

