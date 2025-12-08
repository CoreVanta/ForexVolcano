import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./firebase-config.js";

let app, db, auth;
let isConfigured = false;

// Dummy data for initial UI testing
const dummyPosts = [
    { id: '1', title: 'Welcome to Nebula', excerpt: 'The future of tech is here.', content: 'Full content...', date: new Date(), category: 'Tech' },
    { id: '2', title: 'Why Firebase?', excerpt: 'Serverless architecture explained.', content: 'Full content...', date: new Date(), category: 'Dev' }
];

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        isConfigured = true;
        console.log("Firebase initialized");
    } else {
        console.warn("Firebase config missing. Using dummy mode.");
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// Data Services
export async function getPosts() {
    if (!isConfigured) return dummyPosts;
    try {
        const q = query(collection(db, "posts"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error fetching posts:", e);
        return [];
    }
}

export async function getPost(id) {
    if (!isConfigured) return dummyPosts.find(p => p.id === id);
    try {
        // Optimization: In real app, use getDoc(doc(db, "posts", id))
        // For now, reusing getPosts check since we might not have ID exact match if slug usage changes
        // But let's do direct ID fetch assuming ID is doc ID
        const docRef = doc(db, "posts", id);
        const docSnap = await import("firebase/firestore").then(m => m.getDoc(docRef));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (e) {
        console.error("Error fetching post:", e);
        return null;
    }
}

export async function createPost(postData) {
    if (!isConfigured) throw new Error("Firebase not configured");
    return await addDoc(collection(db, "posts"), {
        ...postData,
        date: serverTimestamp()
    });
}

// Auth Services
export function loginUser(email, password) {
    if (!isConfigured) return Promise.reject("Firebase not configured");
    return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
    if (!isConfigured) return Promise.resolve();
    return signOut(auth);
}

export function onAuth(callback) {
    if (!isConfigured) {
        callback(null); // Always logged out in dummy mode
        return;
    }
    onAuthStateChanged(auth, callback);
}
