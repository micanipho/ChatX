import { AuthService } from './services/AuthService.js';

const authService = new AuthService();

// Navbar Logic (Preserved)
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
        alert(error.message);
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
        alert(error.message);
    }
});