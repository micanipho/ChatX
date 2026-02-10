
const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav_links');
const startChatBtn = document.getElementById('start_chat_btn');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

startChatBtn.addEventListener('click', () => {
    window.location.href = 'pages/sign-up.html';
});

const navLinkItems = navLinks.querySelectorAll('a');
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});
