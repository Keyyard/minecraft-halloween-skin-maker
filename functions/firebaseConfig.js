// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp5m6yfMXDuGViLv3bR8VdgFhEWhHf5uM",
  authDomain: "halloween-skinmaker-keyyard.firebaseapp.com",
  projectId: "halloween-skinmaker-keyyard",
  storageBucket: "halloween-skinmaker-keyyard.appspot.com",
  messagingSenderId: "1097265054444",
  appId: "1:1097265054444:web:342154b0fc317cf5e39bc9",
  measurementId: "G-6WWKGS78VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);