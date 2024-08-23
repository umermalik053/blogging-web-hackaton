import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAvTYAmWlVIj8Jfl2or7rruBGLWmmr9Tns",
    authDomain: "blogging-hackathon.firebaseapp.com",
    projectId: "blogging-hackathon",
    storageBucket: "blogging-hackathon.appspot.com",
    messagingSenderId: "392281080594",
    appId: "1:392281080594:web:96209689921a92594529cb"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  export {storage}