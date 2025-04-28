export default class Review {
    constructor(user, targetName, targetType, text) {
        this.user = user;           // username
        this.targetName = targetName; // cafe or spot name
        this.targetType = targetType; // cafe or spot
        this.text = text;           // review 
        this.timestamp = new Date();
    }

    display() {
        return `
            <div class="review">
                <p><strong>${this.user}</strong> reviewed <strong>${this.targetName}</strong> (${this.targetType})</p>
                <p>"${this.text}"</p>
                <small>${this.timestamp.toLocaleString()}</small>
            </div>
        `;
    }

    edit(newText) {
        this.text = newText;
        this.timestamp = new Date(); 
    }

    delete() {
        this.text = "[Deleted]";
        this.timestamp = new Date();
    }

    getSummary() {
        return `${this.user} reviewed ${this.targetName}: ${this.text.substring(0, 30)}...`;
    }

    toString() {
        return `${this.user} | ${this.targetName} | ${this.targetType} | ${this.text} | ${this.timestamp.toISOString()}`;
    }
}
