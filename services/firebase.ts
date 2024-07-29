import { FirebaseOptions, initializeApp } from 'firebase/app'
import { APP_ENV } from '../constants/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
const devFirebaseConfig = {
  apiKey: "AIzaSyAmkDZKnJg1IzuxjIy52j5wR6-zmRJKvRE",
  authDomain: "kopaville-dev.firebaseapp.com",
  projectId: "kopaville-dev",
  storageBucket: "kopaville-dev.appspot.com",
  messagingSenderId: "731069250399",
  appId: "1:731069250399:web:fe01d43daed77fd09454ea",
  measurementId: "G-S8BKGYH49X",
} as FirebaseOptions;
export const prodFirebaseConfig = {
  apiKey: "AIzaSyADgkZlJ7MOTPd5Ff9xzFHkBB_--bs1ReI",
  authDomain: "kopaville-prod.firebaseapp.com",
  databaseURL: "https://kopaville-prod-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kopaville-prod",
  storageBucket: "kopaville-prod.appspot.com",
  messagingSenderId: "370313108963",
  appId: "1:370313108963:web:38647ef587ca450b8214d6",
  measurementId: "G-HN3H3GKGFF"
};

// Initialize Firebase
export const firebaseApp = initializeApp(APP_ENV === "dev" ? devFirebaseConfig: prodFirebaseConfig, );
export const auth = getAuth(firebaseApp)


export const firestore = getFirestore(firebaseApp);
export const db = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);