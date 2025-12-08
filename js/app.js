import { getPosts, getPost } from './db.js';
import { initAdmin } from './admin.js';

const content = document.getElementById('main-content');
let allPostsCache = [];

// View: Home
async function homeView(categoryFilter = null) {
    const titleText = categoryFilter
        ? `Category: <span style="color:var(--primary)">${decodeURIComponent(categoryFilter)}</span>`
        : `Future <span style="background: var(--gradient-main); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Unleashed</span>`;

    const subText = categoryFilter
        ? `<a href="#home" style="color:var(--text-main); text-decoration:underline">Back to all posts</a>`
        : `Exploring the boundaries of technology and design.`;

    content.innerHTML = `
        <header class="hero" style="text-align: center; margin-bottom: 3rem;">
            <h1>${titleText}</h1>
            <p style="color: var(--text-muted)">${subText}</p>
        </header>
        
        <div class="search-container">
            <input type="text" id="search-input" class="search-input" placeholder="Search articles...">
        </div>

        <div class="posts-grid" id="posts-container">
            <div class="loader"></div>
        </div>
    `;

    const posts = await getPosts();
    allPostsCache = posts;

    // Initial Filter
    let displayPosts = posts;
    if (categoryFilter) {
        displayPosts = posts.filter(p => p.category === decodeURIComponent(categoryFilter));
    }

    renderPosts(displayPosts);

    // Search Listener
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const initialSet = categoryFilter ? posts.filter(p => p.category === decodeURIComponent(categoryFilter)) : posts;

        const filtered = initialSet.filter(post =>
            post.title.toLowerCase().includes(query) ||
            (post.category && post.category.toLowerCase().includes(query))
        );
        renderPosts(filtered);
    });
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    if (posts.length === 0) {
        container.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No posts found.</p>`;
        return;
    }
    container.innerHTML = posts.map(post => `
        <article class="post-card">
            <span class="post-cat">${post.category || 'Uncategorized'}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt || ''}</p>
            <a href="#post/${post.id}" class="read-more" style="color: var(--primary)">Read Article &rarr;</a>
        </article>
    `).join('');
}

// View: Categories
async function categoriesView() {
    content.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    const posts = await getPosts();
    const categories = [...new Set(posts.map(p => p.category))].filter(Boolean);

    content.innerHTML = `
        <header class="hero" style="text-align: center; margin-bottom: 3rem;">
            <h1>Browse <span style="color: var(--accent);">Categories</span></h1>
        </header>
        <div class="posts-grid">
            ${categories.map(cat => `
                <a href="#category/${cat}" class="post-card" style="text-align:center; display:flex; align-items:center; justify-content:center; min-height:150px; text-decoration:none;">
                    <h3 style="color:var(--primary); font-size:1.5rem; margin:0;">${cat}</h3>
                </a>
            `).join('') || '<p style="text-align:center; width:100%">No categories found.</p>'}
        </div>
     `;
}

// View: Single Post
async function postView(id) {
    content.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;

    const post = await getPost(id);

    if (!post) {
        content.innerHTML = `<h2 style="text-align:center">Post not found</h2><p style="text-align:center"><a href="#home">Back to Home</a></p>`;
        return;
    }

    content.innerHTML = `
        <article class="single-post" style="max-width: 800px; margin: 0 auto;">
            <a href="#home" style="color: var(--text-muted); display: block; margin-bottom: 2rem;">&larr; Back to articles</a>
            <span class="post-cat" style="font-size: 1rem;">${post.category || 'Uncategorized'}</span>
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem; line-height: 1.2;">${post.title}</h1>
            <div style="color: var(--text-muted); margin-bottom: 3rem;">
                ${post.date ? new Date(post.date.seconds * 1000).toLocaleDateString() : 'Just now'}
            </div>
            <div class="post-content" style="font-size: 1.1rem; line-height: 1.8;">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
        </article>
    `;
}

// View: Admin
function adminView() {
    content.innerHTML = `<div id="admin-root"></div>`;
    initAdmin(document.getElementById('admin-root'));
}

// Router Logic
const routes = {
    'home': () => homeView(),
    'admin': adminView,
    'categories': categoriesView
};

async function router() {
    const hash = window.location.hash.slice(1) || 'home';

    // Check for params (e.g. post/123)
    if (hash.startsWith('post/')) {
        const id = hash.split('/')[1];
        await postView(id);
        updateNav(''); // No active nav for detail page
        return;
    }

    if (hash.startsWith('category/')) {
        const cat = hash.split('/')[1];
        await homeView(cat);
        updateNav('categories');
        return;
    }

    const baseRoute = hash.split('/')[0];

    updateNav(baseRoute);

    const viewFn = routes[baseRoute] || routes['home'];
    try {
        await viewFn();
    } catch (e) {
        console.error(e);
        document.getElementById('main-content').innerHTML = `<div class="error-msg" style="text-align:center"><h3>Error Loading Page</h3><p>${e.message}</p></div>`;
    }
}

function updateNav(route) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${route}`) {
            link.classList.add('active');
        }
    });
}

// Global Error Handler for debugging
window.onerror = function (msg, url, line) {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed; bottom:0; left:0; width:100%; background:red; color:white; padding:10px; z-index:9999; text-align:center;';
    errDiv.textContent = `System Error: ${msg}`;
    document.body.appendChild(errDiv);
    return false;
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
