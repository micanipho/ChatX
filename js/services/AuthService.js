import { Storage } from '../utils/Storage.js';
import { User } from '../models/User.js';

export class AuthService {
    usersKey = 'userData';
    currentUserKey = 'loggedInUser';

    register(userData) {
        const users = Storage.get(this.usersKey) || {};
        const username = userData.username.trim();

        if (users[username]) {
            throw new Error('Username already exists. Please choose a different one.');
        }

        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match. Please try again.');
        }

        const newUser = new User(
            username,
            userData.password,
            userData.fName,
            userData.lName
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
}
