export class Cafe {
    constructor(id, name, amenities, rating, images, menu, events, reviews) {
        this.id = id;
        this.name = name;
        this.amenities = amenities;
        this.rating = rating;
        this.images = images;
        this.menu = menu;
        this.events = events;
        this.reviews = reviews;
    }

    getTopAmenities() {
        return this.amenities.slice(0, 3).join(', ');
    }

    getAverageRating() {
        return this.rating.toFixed(1);
    }

    getFirstImage() {
        return this.images.length > 0 ? this.images[0] : 'assets/default-cafe.jpg';
    }

    getShortReviews() {
        return this.reviews.map(r => r.comment).slice(0, 2);
    }

    static createFromJson(data) {
        return new Cafe(
            data.id,
            data.name,
            data.amenities,
            data.rating,
            data.images,
            data.menu,
            data.events,
            data.reviews
        );
    }
}
