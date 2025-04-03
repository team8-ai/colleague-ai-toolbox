
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Placeholder config - won't be used in development bypass mode
const firebaseConfig = {
  apiKey: "DEVELOPMENT_MODE",
  authDomain: "DEVELOPMENT_MODE",
  projectId: "DEVELOPMENT_MODE",
  storageBucket: "DEVELOPMENT_MODE",
  messagingSenderId: "DEVELOPMENT_MODE",
  appId: "DEVELOPMENT_MODE"
};

// Initialize app but it won't be used in development bypass mode
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
