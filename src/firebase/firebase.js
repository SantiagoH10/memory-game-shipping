import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAu1aNzUwYRLaulxvhS6ad8YtfsiX0SwIg",
  authDomain: "fir-basics-1746d.firebaseapp.com",
  projectId: "fir-basics-1746d",
  storageBucket: "fir-basics-1746d.firebasestorage.app",
  messagingSenderId: "8331628125",
  appId: "1:8331628125:web:f0b8e3099a696a35bb07b4",
  measurementId: "G-433D0523P5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics = getAnalytics(app);