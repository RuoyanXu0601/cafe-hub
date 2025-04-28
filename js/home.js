import API from './modules/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const query = new URLSearchParams(window.location.search).get('zip') || 'Boston, MA';
    loadFeaturedCafes(query);
});

async function loadFeaturedCafes(location) {
    const cafes = await API.fetchFeaturedCafes(location);
    const carousel = document.getElementById('carouselItems');
    carousel.innerHTML = ''; 

    if (!cafes || cafes.length === 0) {
        carousel.innerHTML = `<div class="carousel-item active"><div class="text-center p-5">No cafés found for "${location}".</div></div>`;
        return;
    }

    cafes.forEach((cafe, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${cafe.photo}" class="d-block w-100" alt="${cafe.name}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${cafe.name}</h5>
                <p>${cafe.location.address || ''}</p>
            </div>
        `;
        carousel.appendChild(item);
    });
}

document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `index.html?zip=${encodeURIComponent(query)}`;
    }
});
