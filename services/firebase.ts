
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAmkDZKnJg1IzuxjIy52j5wR6-zmRJKvRE",
  authDomain: "kopaville-dev.firebaseapp.com",
  projectId: "kopaville-dev",
  storageBucket: "kopaville-dev.appspot.com",
  messagingSenderId: "731069250399",
  appId: "1:731069250399:web:fe01d43daed77fd09454ea",
  measurementId: "G-S8BKGYH49X"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
