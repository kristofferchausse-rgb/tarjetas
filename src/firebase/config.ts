import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCXgnxT7KbG2S6hEI46OcMKixwZ_LW29uM",
  authDomain: "tribucreativaqro.firebaseapp.com",
  projectId: "tribucreativaqro",
  storageBucket: "tribucreativaqro.firebasestorage.app",
  messagingSenderId: "331759664134",
  appId: "1:331759664134:web:cb3a5b9b114b542bb51787"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
