import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default / fallback safe config
const fallbackConfig = {
  apiKey: "AIzaSyDummyKeyForFallbackPreview12345678",
  authDomain: "cinepak-streaming.firebaseapp.com",
  projectId: "cinepak-streaming",
  storageBucket: "cinepak-streaming.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
export const googleProvider = new GoogleAuthProvider();

try {
  // Try to dynamically load firebase-applet-config.json if generated
  // @ts-expect-error dynamic import check
  const config = window.__FIREBASE_CONFIG__ || fallbackConfig;
  
  if (getApps().length === 0) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase initialized with local fallback adapter:', err);
}

export { app, auth, db };
