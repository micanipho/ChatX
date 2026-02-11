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

signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());

    try {
        authService.register(data);
        window.location.href = './log-in.html';
        signupForm.reset();
    } catch (error) {
        console.log(error.message);
        errorBox.textContent = error.message;
    }
});

loginForm?.addEventListener('submit', (event) => { 
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const user = authService.login(data.username, data.password);
        console.log('Logged in user:', user);
        window.location.href = './chat.html';
    } catch (error) {
        console.log(error.message);
        errorBox.textContent = error.message;
    }
});

const profileCircle = document.getElementById('profile-circle');
if (profileCircle) {
    const user = authService.getCurrentUser();
    if (user) {
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        profileCircle.textContent = initials;
    }
}


logoutBtn?.addEventListener('click', () => {
    authService.logout();
    alert('You have been logged out successfully');
    window.location.href = './log-in.html';
});

// Chat Logic
// Chat Logic
const chatListContainer = document.querySelector('.chat-list');
const chatViewContainer = document.querySelector('.chat-view');
if (chatListContainer && chatViewContainer) {
    chatService.renderChats(chatListContainer, chatViewContainer);
}

