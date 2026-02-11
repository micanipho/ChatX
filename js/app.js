
const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav_links');
const startChatBtn = document.getElementById('start_chat_btn');
const signupForm = document.getElementById('signup_form');

menuBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    const isExpanded = navLinks?.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
});

startChatBtn?.addEventListener('click', () => {
    window.location.href = 'pages/sign-up.html';
});

const navLinkItems = navLinks?.querySelectorAll('a');
navLinkItems?.forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
    });
});

signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());
    
    const allUsers = JSON.parse(localStorage.getItem('userData')) || {};

    const username = data.username.trim();

    if (allUsers[username]) {
        alert('Username already exists. Please choose a different one.');
        return; 
    }

    if (data.password !== data.confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return; 
    }

    allUsers[username] = data;

    localStorage.setItem('userData', JSON.stringify(allUsers));

    window.location.href = './log-in.html';

    signupForm.reset();
});

