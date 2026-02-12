import { AuthService } from './services/AuthService.js';

/**
 * Initializes logout modal functionality
 * @param {AuthService} authService - The authentication service instance
 * @returns {Function} Function to show the logout modal
 */
export function initLogoutModal(authService) {
    const logoutModal = document.getElementById('logout-modal');
    const closeLogoutModalBtn = document.getElementById('close-logout-modal-btn');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
    const logoutBtn = document.getElementById('logout-btn');

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

    logoutBtn?.addEventListener('click', () => {
        showLogoutModal();
    });

    closeLogoutModalBtn?.addEventListener('click', hideLogoutModal);
    cancelLogoutBtn?.addEventListener('click', hideLogoutModal);


    confirmLogoutBtn?.addEventListener('click', () => {
        authService.logout();
        hideLogoutModal();
        globalThis.location.href = './log-in.html';
    });

    // Return the show function so it can be used by other modules
    return showLogoutModal;
}
