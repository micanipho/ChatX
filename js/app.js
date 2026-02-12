import { AuthService } from './services/AuthService.js';
import { ChatService } from './services/ChatService.js';
import { ChatHelpers } from './utils/ChatHelpers.js';
import { initForgotPassword } from './forgotPassword.js';
import { initProfilePage } from './profilePage.js';
import { initGroupChat } from './groupChat.js';
import { initChatPage } from './chatInit.js';
import { initLogoutModal } from './logoutModal.js';

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
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const result = await action(data);
            if (redirect) globalThis.location.href = redirect;
            if (result) {
                chatService.setCurrentUser(result);
                chatService.renderChats(chatListContainer, chatViewContainer);
            }
            form.reset();
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });
};

handleAuth(signupForm, (data) => authService.register(data), './log-in.html');
handleAuth(loginForm, (data) => authService.login(data.username, data.password), './chat.html');

// Forgot Password Logic
initForgotPassword(authService);


const profileCircle = document.getElementById('profile-circle');
const profileCircleMobile = document.getElementById('profile-circle-mobile');

if (profileCircle || profileCircleMobile) {
    const user = authService.getCurrentUser();
    if (user) {
        const displayName = ChatHelpers.getUserDisplayName(user);
        const initials = ChatHelpers.getInitials(displayName);
        
        if (profileCircle) profileCircle.textContent = initials;
        if (profileCircleMobile) profileCircleMobile.textContent = initials;
    }
}

// Handle Online Status on Page Close
globalThis.addEventListener('beforeunload', () => {
    const user = authService.getCurrentUser();
    if (user) {
        authService.updateStatus(user.username, false);
    }
});

// Profile Page Logic
initProfilePage(authService, chatService);

// Logout Modal Logic
const showLogoutModal = initLogoutModal(authService);

// Chat Page Logic
initChatPage(authService, chatService);

// Group Chat Logic
initGroupChat(authService, chatService, showLogoutModal);



