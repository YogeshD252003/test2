import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbiZnXt_05NnKJskCSny43RSkx43mMWk0",
  authDomain: "edutrack-yogesh-dev.firebaseapp.com",
  projectId: "edutrack-yogesh-dev",
  storageBucket: "edutrack-yogesh-dev.appspot.com",
  messagingSenderId: "591883402703",
  appId: "1:591883402703:web:0cd7bb02d5f2020a1926ba",
  measurementId: "G-HWVJF5DRR7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
