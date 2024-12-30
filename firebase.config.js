import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWi4h78YXBQFZi0dNjTtC6VAGwipYBRyg",
  authDomain: "com.kumarabhishek404.labour-8a665",
  projectId: "labour-8a665",
  storageBucket: "labour-8a665.firebasestorage.app",
  messagingSenderId: "302414874371",
  appId: "1:302414874371:android:483eb7761074dbff7b4b36",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
