import { Storage } from '../utils/Storage.js';

export class UserService {
    constructor() {
        this.refreshUsers();
    }

    refreshUsers() {
        this.users = Storage.get('userData') || {};
    }

    getUsers() {
        return Object.values(this.users).filter(user => 
            user && typeof user === 'object' && user.username
        );
    }

    getUser(username) {
        return this.users[username];
    }

    updateUser(oldUsername, updatedData) {
        const user = this.users[oldUsername];
        if (!user) return;

        const newUsername = updatedData.username || oldUsername;
        const updatedUser = { ...user, ...updatedData };

        if (newUsername === oldUsername) {
            this.users = { ...this.users, [oldUsername]: updatedUser };
        } else {
            const updatedUsers = { ...this.users, [newUsername]: updatedUser };
            delete updatedUsers[oldUsername];
            this.users = updatedUsers;
        }

        Storage.set('userData', this.users);
        return updatedUser;
    }

    deleteUser(username) {
        if (this.users[username]) {
            delete this.users[username];
            Storage.set('userData', this.users);
        }
    }
}