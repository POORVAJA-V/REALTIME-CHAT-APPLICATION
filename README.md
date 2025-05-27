

# 🔥 Firebase-Powered Chat Application with Profile Update using React + Vite

This is a modern full-stack **React.js** chat application built using **Vite** for bundling and **Firebase** for backend services. The app features a real-time chat system, authentication via email/password, Firestore database integration, cloud storage for profile uploads, and a clean UI rendered with React components.

---

## 📌 Project Features

* 🧑‍💻 **User Authentication** using Firebase Authentication (email/password)
* 🔁 **Real-Time Chat** functionality using Firestore `onSnapshot`
* 🖼️ **Profile Update** with cloud storage integration
* 🚀 **Vite.js** for fast frontend builds and hot reloading
* 📦 **Firestore Database** for persistent data
* ☁️ **Firebase Storage** for storing user-uploaded files
* ⚛️ **React Context API** for state management across the app
* 🧩 Modular React components with separation of logic and presentation

---

## 🗂️ Folder Structure

```bash
├── public/
├── src/
│   ├── components/
│   │   ├── ChatBox.jsx
│   │   ├── ChatBox.css
│   │   ├── LeftSidebar.jsx
│   │   └── RightSidebar.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── ProfileUpdate.jsx
│   │   └── Chat.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── firebase/
│   │   ├── firebase.js
│   │   └── upload.js
│   ├── utils/
│   │   └── assets.js
│   ├── main.jsx
│   └── vite.config.js
├── .gitignore
├── README.md
└── package.json
```

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite.js, CSS
* **Backend**: Firebase Authentication, Firestore, Firebase Storage
* **State Management**: React Context API
* **Bundler**: Vite

---

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd REALTIME-CHAT-APPLICATION
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a file named `firebase.js` in the `src/firebase/` directory and initialize Firebase SDK:

```js
// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 4. Start Development Server

```bash
npm run dev
```

---

## ✨ Key Modules Explained

### 🔐 Authentication Service

* Uses Firebase Auth for login/sign-up with email & password.
* Auth state is managed using React Context.

### 📁 Firestore Database

* Stores user information, chat messages, and profile data.
* Real-time updates using `onSnapshot`.

### ☁️ Firebase Storage

* Upload profile images or any static assets.
* Managed via `upload.js` utility.

### 💬 Chat Functionality

* ChatBox.jsx renders real-time messages.
* Uses Firestore listeners for live updates.

### 🔄 Profile Management

* Users can update their profile via `ProfileUpdate.jsx`.
* Profile data is synced with Firestore and uploaded to Storage.

---
##  DEPLOYED WEBSITE 

https://realtime-chat-application-chi.vercel.app


---

##  DEPLOYMENT LINK 

https://realtime-chat-application-chi.vercel.app
