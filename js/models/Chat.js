export class Chat {
    constructor(id, text, timestamp,sender, receiver) {
        this.id = id;
        this.text = text;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            timestamp: this.timestamp,
            sender: this.sender,
            receiver: this.receiver
        };
    }
}