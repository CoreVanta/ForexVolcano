// import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3nTJlyM3K-XpvEUrXyk3leiVeMxzkTiU",
    authDomain: "forexvolcano-21180.firebaseapp.com",
    projectId: "forexvolcano-21180",
    storageBucket: "forexvolcano-21180.firebasestorage.app",
    messagingSenderId: "264687169302",
    appId: "1:264687169302:web:83322d7adc303b1f0c2a37",
    measurementId: "G-XTB0D1TPS6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
