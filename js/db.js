import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config.js";

let app, db, auth;
let isConfigured = false;

const dummyPosts = [
    { id: '1', title: 'Welcome to Nebula', excerpt: 'The future...', content: 'Content...', date: new Date(), category: 'Tech', published: true },
];

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        isConfigured = true;
    } else {
        console.warn("Firebase config missing. Using dummy mode.");
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// --- Posts ---

export async function getPosts(includeUnpublished = false) {
    if (!isConfigured) return dummyPosts;
    try {
        const q = query(collection(db, "posts"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (includeUnpublished) return posts;
        return posts.filter(p => p.published !== false); // Default true
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getPost(id) {
    if (!isConfigured) return dummyPosts.find(p => p.id === id);
    try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        return null;
    } catch (e) { return null; }
}

export async function createPost(postData) {
    if (!isConfigured) throw new Error("Config missing");
    return await addDoc(collection(db, "posts"), {
        ...postData,
        date: serverTimestamp(),
        published: true
    });
}

export async function updatePost(id, data) {
    if (!isConfigured) throw new Error("Config missing");
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, data);
}

export async function deletePost(id) {
    if (!isConfigured) throw new Error("Config missing");
    await deleteDoc(doc(db, "posts", id));
}

// --- GitHub Media Upload ---

export async function uploadToGitHub(file, token, repo) {
    // Convert file to Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const content = await toBase64(file);
    const filename = `uploads/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const url = `https://api.github.com/repos/${repo}/contents/${filename}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload ${file.name}`,
            content: content
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'GitHub Upload Failed');
    }

    const data = await response.json();
    // Return the raw URL (or jsdelivr CDN for speed)
    return data.content.download_url;
    // Optimization: Use `https://cdn.jsdelivr.net/gh/${repo}@main/${filename}` for faster valid traffic logic later
}

// --- Auth ---

export function loginUser(email, password) {
    if (!isConfigured) return Promise.reject("Config missing");
    return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
    if (!isConfigured) return Promise.resolve();
    return signOut(auth);
}

export function onAuth(callback) {
    if (!isConfigured) return callback(null);
    onAuthStateChanged(auth, callback);
}
