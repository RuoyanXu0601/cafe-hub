import { getCurrentUser, updateCurrentUser } from './modules/auth.js';
import Spot from './modules/spot-class.js';

const API_KEY = "fsq3Y4j9Dj6ORupcxdlObWJ89XOiyBNdGNSMJvIZysPjqGE=";
const BASE_SEARCH_URL = "https://api.foursquare.com/v3/places/search";
const BASE_DETAILS_URL = "https://api.foursquare.com/v3/places";

const filterOptions = document.getElementById("filterOptions");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

async function fetchLeisureSpots(address = "Boston, MA", category = "") {
  const params = new URLSearchParams({
    query: category || "park, museum, tourist attraction",
    near: address,
    limit: 12,
  });

  const response = await fetch(`${BASE_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });

  const data = await response.json();
  return data.results || [];
}

async function fetchPhoto(fsq_id) {
  try {
    const response = await fetch(`${BASE_DETAILS_URL}/${fsq_id}/photos`, {
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    });

    const photos = await response.json();
    if (photos.length > 0) {
      return `${photos[0].prefix}original${photos[0].suffix}`;
    }
  } catch (error) {
    console.error("Failed to fetch photo for", fsq_id, error);
  }
  return null; // Return null if no photo
}

async function displayLeisureSpots(address = "Boston, MA", category = "") {
  const spots = await fetchLeisureSpots(address, category);
  const container = document.getElementById("leisure-list");

  if (spots.length === 0) {
    container.innerHTML = "<p>No beautiful places found nearby.</p>";
    return;
  }

  container.innerHTML = "";
  const user = getCurrentUser();

  for (const spotData of spots) {
    const photoUrl = await fetchPhoto(spotData.fsq_id);
    const spot = new Spot(
      spotData.fsq_id,
      spotData.name,
      spotData.location?.formatted_address || "No address available",
      spotData.categories?.[0]?.name || "Unknown",
      photoUrl
    );

    const card = document.createElement("div");
    card.className = "leisure-card";

    card.innerHTML = `
      <h5>${spot.name}</h5>
      <p><strong>Address:</strong> ${spot.address}</p>
      <p><strong>Category:</strong> ${spot.category}</p>
      ${photoUrl ? `<img src="${photoUrl}" alt="Spot photo" class="leisure-photo">` : `<div class="no-photo">Photo unavailable</div>`}
      <div class="leisure-card-content">
        ${user ? `
          <button class="btn btn-outline-primary btn-sm mt-2 favorite-spot-btn" data-name="${spot.name}">❤️ Favorite</button>
          <button class="btn btn-outline-secondary btn-sm review-spot-btn" data-name="${spot.name}">✏️ Write Review</button>
        ` : `<p class="text-muted mt-2">Login to favorite or review</p>`}
      </div>
    `;
    container.appendChild(card);
  }

  if (user) {
    setupFavoriteSpotButtons();
    setupReviewSpotButtons();
  }
}

function setupFavoriteSpotButtons() {
  const buttons = document.querySelectorAll('.favorite-spot-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const spotName = button.getAttribute('data-name');
      const user = getCurrentUser();
      if (!user.favoritesSpot.includes(spotName)) {
        user.favoritesSpot.push(spotName);
        updateCurrentUser(user);
        alert(`Added "${spotName}" to your favorites!`);
      } else {
        alert(`"${spotName}" is already in your favorites.`);
      }
    });
  });
}

function setupReviewSpotButtons() {
  const buttons = document.querySelectorAll('.review-spot-btn');
  const modal = document.getElementById('reviewModal');
  const closeModal = document.getElementById('closeModal');
  const reviewText = document.getElementById('reviewText');
  const submitReview = document.getElementById('submitReview');

  let currentSpotName = '';

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      currentSpotName = button.getAttribute('data-name');
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
      user.reviews.push({ target: currentSpotName, text: review });
      updateCurrentUser(user);
      alert('Your review has been saved!');
      modal.style.display = 'none';
    } else {
      alert('Please type a review before submitting.');
    }
  });
}

// Event Listener for filter and search
filterOptions.addEventListener("change", () => {
  const selected = filterOptions.value;
  if (selected) {
    displayLeisureSpots("Boston, MA", selected);
  } else {
    displayLeisureSpots();
  }
});

searchButton.addEventListener("click", () => {
  const address = searchInput.value.trim();
  if (address) {
    displayLeisureSpots(address);
  } else {
    displayLeisureSpots();
  }
});

document.addEventListener("DOMContentLoaded", () => displayLeisureSpots());
