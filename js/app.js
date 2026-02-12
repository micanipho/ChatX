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

// Signup with Security Question Modal
let pendingSignupData = null;

signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(signupForm).entries());
    
    // Clear any previous errors
    if (errorBox) errorBox.textContent = '';
    
    // Basic validation
    if (!data.fName || !data.lName || !data.username || !data.password || !data.confirmPassword) {
        if (errorBox) errorBox.textContent = 'All fields are required';
        return;
    }
    
    if (data.password !== data.confirmPassword) {
        if (errorBox) errorBox.textContent = 'Passwords do not match';
        return;
    }
    
    if (data.password.length < 6) {
        if (errorBox) errorBox.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    // Store the initial form data
    pendingSignupData = data;
    
    // Show the security question modal
    const securityModal = document.getElementById('security-modal');
    if (securityModal) {
        securityModal.classList.remove('hidden');
    }
});

// Security Question Modal Logic
const securityModal = document.getElementById('security-modal');
const securityForm = document.getElementById('security-form');
const closeSecurityModal = document.getElementById('close-security-modal');
const securityModalOverlay = securityModal?.querySelector('.modal-overlay');
const securityErrorBox = securityForm?.querySelector('.errorBox');

// Close modal on X button click
closeSecurityModal?.addEventListener('click', () => {
    securityModal?.classList.add('hidden');
    pendingSignupData = null;
});

// Close modal on overlay click
securityModalOverlay?.addEventListener('click', () => {
    securityModal?.classList.add('hidden');
    pendingSignupData = null;
});

// Handle security form submission
securityForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!pendingSignupData) {
        if (securityErrorBox) securityErrorBox.textContent = 'Session expired. Please try again.';
        return;
    }
    
    const securityData = Object.fromEntries(new FormData(securityForm).entries());
    
    // Clear any previous errors
    if (securityErrorBox) securityErrorBox.textContent = '';
    
    // Combine initial signup data with security question data
    const completeData = {
        ...pendingSignupData,
        ...securityData
    };
    
    try {
        await authService.register(completeData);
        
        // Success - close modal and redirect
        securityModal?.classList.add('hidden');
        securityForm.reset();
        signupForm.reset();
        pendingSignupData = null;
        
        globalThis.location.href = './log-in.html';
    } catch (error) {
        if (securityErrorBox) securityErrorBox.textContent = error.message;
    }
});

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



