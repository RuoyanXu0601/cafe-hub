import api from './modules/api.js';
import { getCurrentUser, updateCurrentUser } from './modules/auth.js';

const cafeList = document.getElementById('cafe-list');
const filter = document.getElementById('filter');
const searchButton = document.getElementById('searchButton');
const searchLocation = document.getElementById('searchLocation');

let allCafes = [];
let currentCafeName = '';

function renderCafes(cafes) {
  cafeList.innerHTML = "";
  const user = getCurrentUser();

  cafes.forEach(cafe => {
    const div = document.createElement('div');
    div.className = 'cafe-card';
    div.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}">
      <div class="cafe-info">
        <h3>${cafe.name}</h3>
        <p>${cafe.location.address}</p>
        <p>⭐ ${cafe.rating}</p>
        <a href="cafe-detail.html?id=${cafe.id}" class="btn">View</a>
        ${user ? `
          <button class="btn btn-outline-primary btn-sm mt-2 favorite-btn" data-name="${cafe.name}">❤️ Favorite</button>
          <button class="btn btn-outline-secondary btn-sm review-btn" data-name="${cafe.name}">✏️ Write Review</button>
        ` : `<p class="text-muted mt-2">Login to favorite or review</p>`}
      </div>
    `;
    cafeList.appendChild(div);
  });

  if (user) {
    setupFavoriteButtons();
    setupReviewButtons();
  }
}

function setupFavoriteButtons() {
  const buttons = document.querySelectorAll('.favorite-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const cafeName = button.getAttribute('data-name');
      const user = getCurrentUser();
      if (!user.favoritesCafe.includes(cafeName)) {
        user.favoritesCafe.push(cafeName);
        updateCurrentUser(user);
        alert(`Added "${cafeName}" to your favorites!`);
      } else {
        alert(`"${cafeName}" is already in your favorites.`);
      }
    });
  });
}

function setupReviewButtons() {
  const buttons = document.querySelectorAll('.review-btn');
  const modal = document.getElementById('reviewModal');
  const closeModal = document.getElementById('closeModal');
  const reviewText = document.getElementById('reviewText');
  const submitReview = document.getElementById('submitReview');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      currentCafeName = button.getAttribute('data-name');
      reviewText.value = '';
      modal.style.display = 'block';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  submitReview.addEventListener('click', () => {
    const review = reviewText.value.trim();
    if (review) {
      const user = getCurrentUser();
      user.reviews.push({ target: currentCafeName, text: review });
      updateCurrentUser(user);
      alert('Your review has been saved!');
      modal.style.display = 'none';
    } else {
      alert('Please type a review before submitting.');
    }
  });
}

function applyFilter(type) {
  let filtered = [...allCafes];
  if (type === "pet") {
    filtered = filtered.filter(c => c.categories.some(cat => cat.name.toLowerCase().includes("pet")));
  } else if (type === "rating") {
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (type === "amenity") {
    filtered = filtered.filter(c => c.categories.some(cat => cat.name.toLowerCase().includes("coffee")));
  }
  renderCafes(filtered);
}

filter.addEventListener("change", () => {
  const val = filter.value;
  applyFilter(val);
});

searchButton.addEventListener("click", async () => {
  const locationInput = searchLocation.value.trim();
  if (locationInput) {
    allCafes = await api.fetchFeaturedCafes(locationInput);
    renderCafes(allCafes);
  } else {
    allCafes = await api.fetchFeaturedCafes();
    renderCafes(allCafes);
  }
});

async function init() {
  allCafes = await api.fetchFeaturedCafes();
  renderCafes(allCafes);
}
init();
