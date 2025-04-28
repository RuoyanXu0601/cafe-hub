// Save user to local storage
function registerUser(name, nickname, email, password, signature) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exist
    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please log in.');
        return false;
    }

    const newUser = {
        name,
        nickname,
        email,
        password,
        signature,
        favoritesCafe: [],
        favoritesSpot: [],
        reviews: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

// Log in existing user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    } else {
        return false;
    }
}

// Log out
export function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Update user info
export function updateCurrentUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => user.email === updatedUser.email ? updatedUser : user);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
}

// Get current log in user
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Sign up 
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const nickname = document.getElementById('signupNickname').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const signature = document.getElementById('signupSignature').value;

        if (registerUser(name, nickname, email, password, signature)) {
            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        }
    });
}

// Log in
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (loginUser(email, password)) {
            alert('Login successful!');
            window.location.href = 'profile.html';
        } else {
            alert('Invalid email or password.');
        }
    });
}

// Log out button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logoutUser();
    });
}
