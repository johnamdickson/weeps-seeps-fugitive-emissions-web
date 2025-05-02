// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-a2KJUssRSA_KwcDyVZD4pcTRYEqpkWs",
  authDomain: "weeps-seeps-fugitive-emissions.firebaseapp.com",
  databaseURL: "https://weeps-seeps-fugitive-emissions-default-rtdb.firebaseio.com",
  projectId: "weeps-seeps-fugitive-emissions",
  storageBucket: "weeps-seeps-fugitive-emissions.appspot.com",
  messagingSenderId: "118529299623",
  appId: "1:118529299623:web:2a35a45c7911aaff56f782",
  measurementId: "G-4ESQM00Y1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
