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

    updateUser(username, userUpdatedData) {
        if (this.users[username]) {
            this.users[username] = { ...this.users[username], ...userUpdatedData };
            Storage.set('userData', this.users);
        }
    }

    deleteUser(username) {
        if (this.users[username]) {
            delete this.users[username];
            Storage.set('userData', this.users);
        }
    }
}