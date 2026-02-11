export class User {
    constructor(username, password, firstName, lastName) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    toJSON() {
        return {
            username: this.username,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName
        };
    }
}
