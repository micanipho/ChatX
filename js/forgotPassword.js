import { AuthService } from './services/AuthService.js';
import { Notification } from './utils/Notification.js';

/**
 * Initializes the forgot password flow
 * @param {AuthService} authService - The authentication service instance
 */
export function initForgotPassword(authService) {
    const forgotPasswordForm = document.getElementById('forgot_password_form');
    if (!forgotPasswordForm) return;

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const verifyUsernameBtn = document.getElementById('verify-username-btn');
    const verifyAnswerBtn = document.getElementById('verify-answer-btn');
    const displayQuestion = document.getElementById('display-question');
    const errorBox = document.getElementsByClassName('errorBox')[0];
    
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

            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            displayQuestion.textContent = '';
        }
    });

    verifyAnswerBtn?.addEventListener('click', async () => {
        const answer = document.getElementById('securityAnswer').value.trim();
        if (!answer) {
            errorBox.textContent = 'Please provide an answer.';
            return;
        }

        try {
            await authService.verifySecurityAnswer(currentUsername, answer);
            step2.classList.add('hidden');
            step3.classList.remove('hidden');
            errorBox.textContent = '';
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            errorBox.textContent = 'Passwords do not match.';
            return;
        }

        try {
            await authService.resetPassword(currentUsername, newPassword);
            Notification.success('Password reset successfully! Please login with your new password.');
            globalThis.location.href = './log-in.html';
        } catch (error) {
            errorBox.textContent = error.message;
        }
    });
}
