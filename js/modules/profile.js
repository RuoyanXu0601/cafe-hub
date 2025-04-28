import { getCurrentUser, updateCurrentUser, logoutUser } from './auth.js';
// Check log in status
const user = getCurrentUser();
if (!user) {
    alert('Please log in first.');
    window.location.href = 'login.html';
}

// Load profile
document.getElementById('profileNickname').textContent = user.nickname;
document.getElementById('profileSignature').textContent = user.signature;

// Edit Profile
document.getElementById('editName').value = user.name;
document.getElementById('editNickname').value = user.nickname;
document.getElementById('editSignature').value = user.signature;

// Save
document.getElementById('editProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = document.getElementById('editName').value;
    user.nickname = document.getElementById('editNickname').value;
    user.signature = document.getElementById('editSignature').value;

    updateCurrentUser(user);
    alert('Profile updated successfully!');
    window.location.reload();
});

// Global remove
window.removeCafe = function (cafe) {
    user.favoritesCafe = user.favoritesCafe.filter(item => item !== cafe);
    updateCurrentUser(user);
    renderFavorites();
};

window.removeSpot = function (spot) {
    user.favoritesSpot = user.favoritesSpot.filter(item => item !== spot);
    updateCurrentUser(user);
    renderFavorites();
};

window.removeReview = function (target, text) {
    user.reviews = user.reviews.filter(r => !(r.target === target && r.text === text));
    updateCurrentUser(user);
    renderFavorites();
};

// Favorites and Reviews
function renderFavorites() {
    const favoritesCafeList = document.getElementById('favoritesCafeList');
    const favoritesSpotList = document.getElementById('favoritesSpotList');
    const myReviewsList = document.getElementById('myReviewsList');

    favoritesCafeList.innerHTML = '';
    favoritesSpotList.innerHTML = '';
    myReviewsList.innerHTML = '';

    if (user.favoritesCafe.length === 0) {
        favoritesCafeList.innerHTML = "<p class='text-muted'>No favorite cafés yet.</p>";
    } else {
        user.favoritesCafe.forEach(cafe => {
            const div = document.createElement('div');
            div.className = 'col-md-4 mb-3';
            div.innerHTML = `
                <div class="card p-3 shadow-sm d-flex flex-column">
                    <div class="flex-grow-1">${cafe}</div>
                    <button class="btn btn-sm btn-danger mt-2" onclick="removeCafe('${cafe}')">Remove ❌</button>
                </div>
            `;
            favoritesCafeList.appendChild(div);
        });
    }

    if (user.favoritesSpot.length === 0) {
        favoritesSpotList.innerHTML = "<p class='text-muted'>No favorite spots yet.</p>";
    } else {
        user.favoritesSpot.forEach(spot => {
            const div = document.createElement('div');
            div.className = 'col-md-4 mb-3';
            div.innerHTML = `
                <div class="card p-3 shadow-sm d-flex flex-column">
                    <div class="flex-grow-1">${spot}</div>
                    <button class="btn btn-sm btn-danger mt-2" onclick="removeSpot('${spot}')">Remove ❌</button>
                </div>
            `;
            favoritesSpotList.appendChild(div);
        });
    }

    if (user.reviews.length === 0) {
        myReviewsList.innerHTML = "<p class='text-muted'>No reviews written yet.</p>";
    } else {
        user.reviews.forEach(review => {
            const div = document.createElement('div');
            div.className = 'list-group-item d-flex justify-content-between align-items-center';
            div.innerHTML = `
                <div><strong>${review.target}</strong>: ${review.text}</div>
                <button class="btn btn-sm btn-danger" onclick="removeReview('${review.target}', '${review.text}')">Remove ❌</button>
            `;
            myReviewsList.appendChild(div);
        });
    }
}

renderFavorites();
