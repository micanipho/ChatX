import { Storage } from '../utils/Storage.js';
import { User } from '../models/User.js';

export class AuthService {
    usersKey = 'userData';
    currentUserKey = 'loggedInUser';

    register(userData) {
        const users = Storage.get(this.usersKey) || {};
        const { username: rawUsername, password, confirmPassword, fName, lName, securityQuestion, securityAnswer } = userData;
        const username = rawUsername.trim();

        if (users[username]) {
            throw new Error('Username already exists. Please choose a different one.');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match. Please try again.');
        }

        if (!securityQuestion || !securityAnswer) {
            throw new Error('Please provide a security question and answer.');
        }

        // Note: confirmPassword is used only for validation and is NOT passed to the User constructor,
        // ensuring it is never persisted to storage.
        const newUser = new User(
            username,
            password,
            fName,
            lName,
            securityQuestion,
            securityAnswer
        );

        users[username] = newUser.toJSON();
        Storage.set(this.usersKey, users);
        return newUser;
    }

    login(username, password) {
        const users = Storage.get(this.usersKey) || {};
        const user = users[username.trim()];

        if (!user || user.password !== password) {
            throw new Error('Invalid username or password. Please try again.');
        }

        Storage.setSession(this.currentUserKey, user);
        return user;
    }

    logout() {
        Storage.removeSession(this.currentUserKey);
    }

    getCurrentUser() {
        return Storage.getSession(this.currentUserKey);
    }

    getSecurityQuestion(username) {
        const users = Storage.get(this.usersKey) || {};
        const user = users[username.trim()];
        if (!user) throw new Error('User not found.');
        return user.securityQuestion;
    }

    verifySecurityAnswer(username, answer) {
        const users = Storage.get(this.usersKey) || {};
        const user = users[username.trim()];
        if (!user) throw new Error('User not found.');
        
        // Simple case-insensitive match for basic usability
        if (user.securityAnswer.trim().toLowerCase() !== answer.trim().toLowerCase()) {
            throw new Error('Incorrect security answer.');
        }
        return true;
    }

    resetPassword(username, newPassword) {
        const users = Storage.get(this.usersKey) || {};
        const user = users[username.trim()];
        if (!user) throw new Error('User not found.');

        if (newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }

        user.password = newPassword;
        users[username] = user;
        Storage.set(this.usersKey, users);
        return true;
    }
}
