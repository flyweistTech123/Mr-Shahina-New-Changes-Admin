/** @format */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.React_App_Firebase_apikey,
  authDomain: process.env.React_App_Firebase_authDomain,
  projectId: process.env.React_App_Firebase_projectId,
  storageBucket: process.env.React_App_Firebase_storageBucket,
  messagingSenderId: process.env.React_App_Firebase_messagingSenderId,
  appId: process.env.React_App_Firebase_appId,
  measurementId: process.env.React_App_Firebase_measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
