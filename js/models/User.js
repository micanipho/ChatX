export class User {
    constructor(username, password, firstName, lastName, securityQuestion, securityAnswer) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
        this.chats = [];
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            securityQuestion: this.securityQuestion,
            securityAnswer: this.securityAnswer
        };
    }
}
