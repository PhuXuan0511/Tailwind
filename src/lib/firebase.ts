import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage";

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

const useEmulator = () => import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

export const setupFirebase = () => {
  try {
    firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
    });

    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);

    if (useEmulator()) {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(firestore, "localhost", 8080);
      connectStorageEmulator(storage, "localhost", 9199);
    }

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
};

// Reintroduce the useFirestore helper function
export const useFirestore = () => firestore;

export { auth, firestore, storage };
