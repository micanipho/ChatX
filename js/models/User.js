export class User {
    constructor(username, password, firstName, lastName, securityQuestion, securityAnswer, salt = '') {
        this.username = username;
        this.password = password; // Now stores hashed password
        this.firstName = firstName;
        this.lastName = lastName;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
        this.salt = salt;
        this.isOnline = false;
        this.lastSeen = new Date().toISOString();
        this.chats = [];
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            securityQuestion: this.securityQuestion,
            securityAnswer: this.securityAnswer,
            salt: this.salt,
            isOnline: this.isOnline,
            lastSeen: this.lastSeen
        };
    }
}
