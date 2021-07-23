import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyD3-pnAPnBMzBqL_dAZYYyVGretc42zUnA",
  authDomain: "auth-development-b73b7.firebaseapp.com",
  projectId: "auth-development-b73b7",
  storageBucket: "auth-development-b73b7.appspot.com",
  messagingSenderId: "1011248109211",
  appId: "1:1011248109211:web:f1a7fea7afe4c601dd583e",
};

/*
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
*/

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
