export default class Cafe {
    constructor(id, name, address, category, photo) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.category = category;
        this.photo = photo;
        this.isFavorite = false;
    }

    displayInfo() {
        return `
            <h3>${this.name}</h3>
            <p><strong>Address:</strong> ${this.address}</p>
            <p><strong>Category:</strong> ${this.category}</p>
            <img src="${this.photo}" alt="Cafe photo" style="width:100%; height:auto; border-radius:8px; margin-top:10px;">
        `;
    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        return this.isFavorite;
    }

    writeReview(reviewText) {
        return {
            cafeId: this.id,
            review: reviewText,
            timestamp: new Date().toISOString()
        };
    }

    getLocation() {
        return this.address;
    }

    getPhoto() {
        return this.photo;
    }
}
