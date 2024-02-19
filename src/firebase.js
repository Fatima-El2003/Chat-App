// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = { 
  apiKey : "AIzaSyBR5tKMsm8eX0C9odjU7Aa_Z8N1SJiE8yA" , 
  authDomain : "project1-e3a8a.firebaseapp.com" , 
  projectId : "project1-e3a8a" , 
  storageBucket : "project1-e3a8a.appspot.com" , 
  messagingSenderId : "682686259946" , 
  appId : "1:682686259946:web:81a1831187719caf5a2d93" 
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();
