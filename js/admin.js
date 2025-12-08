import { loginUser, logoutUser, createPost, updatePost, deletePost, getPosts, uploadToGitHub, onAuth } from './db.js';

let quill;
let currentEditingId = null;

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
        try {
            await loginUser(document.getElementById('email').value, document.getElementById('password').value);
        } catch (error) {
            document.getElementById('login-error').textContent = error.message;
        }
    });
}

async function renderDashboard(container, user) {
    container.innerHTML = `
        <div class="dashboard">
            <header class="dash-header">
                <h3>Admin: ${user.email}</h3>
                <div>
                   <button id="gh-settings-btn" class="btn-secondary" style="margin-right:1rem">GitHub Settings</button>
                   <button id="show-list-btn" class="btn-secondary" style="margin-right:1rem">Manage Posts</button>
                   <button id="logout-btn" class="btn-secondary">Logout</button>
                </div>
            </header>
            
            <!-- List View -->
            <div id="posts-list-view">
                <div class="dash-actions">
                    <button id="create-new-btn" class="btn-primary">+ Create New Article</button>
                </div>
                <div id="admin-posts-table" class="posts-grid" style="grid-template-columns: 1fr; gap: 1rem; margin-top:2rem;">
                    <p>Loading...</p>
                </div>
            </div>

            <!-- Editor View -->
            <div id="editor-view" style="display:none;">
                <h4 id="editor-title">Create Article</h4>
                <form id="post-form">
                    <input type="text" id="post-title" placeholder="Article Title" required>
                    <input type="text" id="post-cat" placeholder="Category">
                    
                    <div id="editor-wrapper">
                        <div id="editor-container"></div>
                    </div>
                    
                    <div style="margin-top: 2rem; display:flex; gap:1rem;">
                        <button type="submit" class="btn-primary">Save / Publish</button>
                        <button type="button" id="cancel-edit" class="btn-secondary">Cancel</button>
                    </div>
                </form>
                <input type="file" id="media-input" style="display:none" accept="image/*,video/*">
            </div>

            <!-- GitHub Settings Modal -->
            <div id="gh-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2000;">
                <div class="login-card">
                    <h3>GitHub Upload Settings</h3>
                    <p style="font-size:0.9rem; color:var(--text-muted)">Required for image uploads. Token is saved locally.</p>
                    <input type="text" id="gh-repo" placeholder="username/repo-name">
                    <input type="password" id="gh-token" placeholder="Personal Access Token (Repo Scope)">
                    <button id="save-gh-btn" class="btn-primary">Save Settings</button>
                    <button id="close-gh-btn" class="btn-secondary" style="margin-top:1rem">Close</button>
                </div>
            </div>
        </div>
            title: document.getElementById('post-title').value,
            category: document.getElementById('post-cat').value,
            content: quill.root.innerHTML,
            excerpt: quill.getText().substring(0, 150) + '...'
        };

        try {
            if (currentEditingId) {
                await updatePost(currentEditingId, data);
            } else {
                await createPost(data);
            }
            alert('Saved successfully!');
            showList();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });

    refreshList();
}

async function refreshList() {
    const table = document.getElementById('admin-posts-table');
    const posts = await getPosts(true);

    if (posts.length === 0) {
        table.innerHTML = '<p>No posts yet.</p>';
        return;
    }

    table.innerHTML = posts.map(p => `
        < div class="post-card" style = "display:flex; justify-content:space-between; align-items:center; opacity: ${p.published ? 1 : 0.5}" >
            <div>
                <h4 style="margin:0">${p.title} ${p.published ? '' : '(HIDDEN)'}</h4>
                <small style="color:var(--text-muted)">${new Date(p.date?.seconds * 1000).toLocaleDateString()}</small>
            </div>
            <div style="display:flex; gap:0.5rem">
                <button class="btn-secondary btn-sm" onclick="window.editPost('${p.id}')">Edit</button>
                <button class="btn-secondary btn-sm" onclick="window.togglePub('${p.id}', ${!p.published})">
                    ${p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button class="btn-secondary btn-sm" style="background:red" onclick="window.delPost('${p.id}')">Delete</button>
            </div>
        </div >
        `).join('');
}

window.editPost = async (id) => {
    const posts = await getPosts(true);
    const post = posts.find(p => p.id === id);
    if (post) openEditor(post);
};

window.togglePub = async (id, status) => {
    if (confirm(`Set visibility to ${ status }?`)) {
        await updatePost(id, { published: status });
        refreshList();
    }
};

window.delPost = async (id) => {
    if (confirm('Delete permanently?')) {
        await deletePost(id);
        refreshList();
    }
};

function openEditor(post = null) {
    document.getElementById('posts-list-view').style.display = 'none';
    document.getElementById('editor-view').style.display = 'block';

    if (post) {
        currentEditingId = post.id;
        document.getElementById('editor-title').textContent = "Edit Article";
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-cat').value = post.category || '';
        quill.root.innerHTML = post.content || '';
    } else {
        currentEditingId = null;
        document.getElementById('editor-title').textContent = "Create Article";
        document.getElementById('post-title').value = '';
        document.getElementById('post-cat').value = '';
        quill.root.innerHTML = '';
    }
}

function showList() {
    document.getElementById('posts-list-view').style.display = 'block';
    document.getElementById('editor-view').style.display = 'none';
    refreshList();
}
