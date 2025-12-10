// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "pwa-lucas-firmino.firebaseapp.com",
  databaseURL: "https://pwa-lucas-firmino-default-rtdb.firebaseio.com",
  projectId: "pwa-lucas-firmino",
  storageBucket: "pwa-lucas-firmino.appspot.com",
  messagingSenderId: "795824700588",
  appId: "1:795824700588:web:5489c3c357932d6d70f309",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


