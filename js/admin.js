import { loginUser, logoutUser, createPost, onAuth } from './db.js';

export function initAdmin(container) {
    onAuth(user => {
        if (user) {
            renderDashboard(container, user);
        } else {
            renderLoginForm(container);
        }
    });
}

function renderLoginForm(container) {
    container.innerHTML = `
        <div class="login-card">
            <h2>Admin Access</h2>
            <form id="login-form">
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Password" required>
                <button type="submit" class="btn-primary">Login</button>
            </form>
            <p id="login-error" class="error-msg"></p>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('login-error');

        try {
            await loginUser(email, pass);
        } catch (error) {
            errorMsg.textContent = "Login failed: " + error.message;
        }
    });
}

function renderDashboard(container, user) {
    container.innerHTML = `
        <div class="dashboard">
            <header class="dash-header">
                <h3>Welcome, ${user.email}</h3>
                <button id="logout-btn" class="btn-secondary">Logout</button>
            </header>
            
            <div class="dash-actions">
                <button id="new-post-btn" class="btn-primary">+ New Post</button>
            </div>
            
            <div id="editor-container" style="display:none;">
                <h4>Create Post</h4>
                <form id="post-form">
                    <input type="text" id="post-title" placeholder="Title" required>
                    <input type="text" id="post-cat" placeholder="Category">
                    <textarea id="post-content" rows="10" placeholder="Write something amazing..."></textarea>
                    <button type="submit" class="btn-primary">Publish</button>
                    <button type="button" id="cancel-post" class="btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', () => logoutUser());

    // Toggle Editor
    const editor = document.getElementById('editor-container');
    document.getElementById('new-post-btn').addEventListener('click', () => {
        editor.style.display = 'block';
    });

    document.getElementById('cancel-post').addEventListener('click', () => {
        editor.style.display = 'none';
    });

    // Handle Publish
    document.getElementById('post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-cat').value;
        const content = document.getElementById('post-content').value;

        try {
            await createPost({ title, category, content, excerpt: content.substring(0, 100) + '...' });
            alert('Post published!');
            editor.style.display = 'none';
            e.target.reset();
        } catch (error) {
            alert('Error publishing: ' + error.message);
        }
    });
}
