
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Check if user's email belongs to the allowed domain
    const email = result.user.email;
    if (!email || !email.endsWith('@yourdomain.com')) {
      // If not from the allowed domain, sign them out
      await firebaseSignOut(auth);
      throw new Error('Only users from your organization can sign in.');
    }
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google: ", error);
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
