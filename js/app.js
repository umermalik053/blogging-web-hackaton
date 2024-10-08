import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";

const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

let image = document.querySelector("#image");
let uploadTask;
let ImageUrl;

if (image) {
  image.addEventListener("change", () => {
    console.log(image);
    const files = image.files[0];
    const imagesRefWithFolder = ref(storage, files.name);
    uploadTask = uploadBytesResumable(imagesRefWithFolder, files);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          ImageUrl = downloadURL;
          console.log(ImageUrl);
        });
      }
    );
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Signup successful!");
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful!");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}
let googlebtn = document.querySelector("#googleid");
if (googlebtn) {
  googlebtn.addEventListener("click", (e) => {
    e.preventDefault(e);

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });
}

const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      ImageUrl,
      uid: auth.currentUser.uid,
    });
    loadPosts();
  });
}

// let blogs = document.querySelector("#blogs")
async function onload() {
  const blogsDiv = document.getElementById("blogs");

  if (blogsDiv) {
    blogsDiv.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "posts"));

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const post = document.createElement("div");
      // post.classList.add("blog-post");
      post.innerHTML = `
               <div class="card" style="width: 18rem;">
               <img src="${postData.ImageUrl}" class="card-img-top" alt="...">
               <div class="card-body">
               <h5 class="card-title">${postData.title}</h5>
               <p class="card-text">${postData.content}</p>
              </div>
              </div>
                `;
      blogsDiv.appendChild(post);
    });
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  onload();
});

async function loadPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  const q = query(
    collection(db, "posts"),
    where("uid", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const post = document.createElement("div");
    post.classList.add("post");
    post.innerHTML = `<h3 class="content">${
      doc.data().title
    }</h3><p class="content">${doc.data().content}</p>`;
    postsDiv.appendChild(post);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html")
    ) {
      window.location.href = "dashboard.html";
    } else if (window.location.pathname.includes("dashboard.html")) {
      loadPosts();
    }
  } else {
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});
