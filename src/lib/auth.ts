
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Domain restriction is now bypassed
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Add a bypass login function for development
export const bypassLogin = async () => {
  try {
    // Use a test email and password
    const email = "test@example.com";
    const password = "testpassword123";
    
    try {
      // Try to sign in first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (loginError) {
      // If login fails, create the account and then sign in
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }
  } catch (error: any) {
    console.error("Error with bypass login: ", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
