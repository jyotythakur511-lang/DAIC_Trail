/**
 * auth.js - Client-Side Authentication Mock
 * Evaluates session state and manages Login / Signup flows via localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuthSystem();
});

function initAuthSystem() {
    // 1. Update Navigation UI based on Auth State
    updateNavbarAuthUI();

    // 2. Attach Event Listeners for Login/Register if forms exist on page
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Toggle logic for Login/Signup page
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');

    if (showSignupBtn && showLoginBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }
}

function updateNavbarAuthUI() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return; // If nav doesn't have an auth container, skip.

    const activeUser = getActiveUser();

    if (activeUser) {
        // Logged In State
        authContainer.innerHTML = `
            <div class="user-profile" style="display: flex; align-items: center; gap: 15px;">
                <button id="logout-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;">Logout</button>
                <div class="user-badge" style="display: flex; align-items: center; gap: 8px; color: var(--text-main); font-weight: 500;">
                    <div style="width: 35px; height: 35px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: #000; font-weight: 700;">
                        ${activeUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="user-name-text">${activeUser.name}</span>
                </div>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        // Logged Out State
        authContainer.innerHTML = `
            <a href="login.html" class="btn btn-primary" style="padding: 8px 20px; font-size: 0.95rem;">Sign In</a>
        `;
    }
}

function getActiveUser() {
    const userStr = localStorage.getItem('activeUser');
    return userStr ? JSON.parse(userStr) : null;
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorMsg = document.getElementById('login-error');

    const users = JSON.parse(localStorage.getItem('daic_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Successful login
        localStorage.setItem('activeUser', JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = 'index.html';
    } else {
        errorMsg.textContent = 'Invalid email or password.';
        errorMsg.style.display = 'block';
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const errorMsg = document.getElementById('reg-error');

    let users = JSON.parse(localStorage.getItem('daic_users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        errorMsg.textContent = 'Email is already registered.';
        errorMsg.style.display = 'block';
        return;
    }

    // Save new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('daic_users', JSON.stringify(users));

    // Auto-login after registration
    localStorage.setItem('activeUser', JSON.stringify({ name, email }));
    alert('Registration successful! Logging you in...');
    window.location.href = 'index.html';
}

function handleLogout() {
    localStorage.removeItem('activeUser');
    window.location.href = 'index.html';
}
