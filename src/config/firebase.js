// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {createUserWithEmailAndPassword,getAuth,sendPasswordResetEmail,signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore,doc,setDoc,serverTimestamp, collection, query, where, getDocs} from "firebase/firestore";
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyB9uyfM6b9DU8OxwyS9KqKLTm8lv4P1JHE",
  authDomain: "chat-app-gs-afaf8.firebaseapp.com",
  projectId: "chat-app-gs-afaf8",
  storageBucket: "chat-app-gs-afaf8.firebasestorage.app",
  messagingSenderId: "345063246690",
  appId: "1:345063246690:web:89216de3165aeba6153a3b",
  measurementId: "G-CDG0D5MRY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signup=async (username,email, password) => {
try{
    const res=await createUserWithEmailAndPassword(auth,email,password);
    const user=res.user;
    await setDoc(doc(db,"users",user.uid),{
          id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey,There i am using chatty",
        lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
        chatsData:[ ]
        })
}catch(error){
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
}
}
const login = async(email,password)=>{
try{
    await signInWithEmailAndPassword(auth,email,password);
}catch(error){
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
}
}

const logout= async ()=>{
   try{
    await signOut(auth)
   }catch (error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
   }
}

const resetPass=async(email) =>{
    if(!email){
        toast.error("Please enter your email");
        return null;
    }
    try{
        const userRef = collection(db,"users");
        const q=query(userRef,where("email","==",email));
        const querySnap=await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset mail has been sent")
        }else{
            toast.error("Email doesn't exists")
        }
    }catch(error){
        toast.error(error.message)
    }
}

export {signup,login,logout,auth,db,resetPass}