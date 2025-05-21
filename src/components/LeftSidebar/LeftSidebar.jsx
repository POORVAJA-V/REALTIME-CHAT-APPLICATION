import React, { useContext, useEffect, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { db,logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData,chatUser ,setChatUser,setMessagesId, messagesId,chatVisible,setChatVisible} = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

const inputHandler = async (e) => {
  try {
    const input = e.target.value.toLowerCase();
    setUser(null); // reset previous result

    if (input) {
      setShowSearch(true);
      const userRef = collection(db, "users");

      // Set range for "startsWith"
      const end = input + "\uf8ff"; // highest unicode char to complete prefix match

      const q = query(userRef,
        where("username", ">=", input),
        where("username", "<=", end)
      );

      const querySnap = await getDocs(q);

     let results = [];
querySnap.forEach((docSnap) => {
  const userDoc = docSnap.data();
  if (userDoc.id !== userData.id && !chatData.some(u => u.rId === userDoc.id)) {
    results.push(userDoc);
  }
});
setSearchResults(results); // use this to display a list

    } else {
      setShowSearch(false);
    }
  } catch (error) {
    console.error("Search error:", error.message);
  }
};



  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
const uSnap=await getDoc(doc(db,"users",user.id));
const uData=uSnap.data();
setChat({
  messagesId:newMessageRef.id,
  lastMessage:"",
  rId:user.id,
  updatedAt:Date.now(),
  messageSeen:true,
  userData:uData,
})
setShowSearch(false)
setChatVisible(true)

    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

const setChat = async (item) => {
  try {
    setMessagesId(item.messageId);
    setChatUser(item);

    const userChatsRef = doc(db, "chats", userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);

    if (userChatsSnapshot.exists()) {
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex(
        (c) => c.messageId === item.messageId
      );

      if (chatIndex !== -1) {
        userChatsData.chatsData[chatIndex].messageSeen = true;

        await updateDoc(userChatsRef, {
          chatsData: userChatsData.chatsData,
        });
      }
    }
    setChatVisible(true);
  } catch (error) {
    toast.error(error.message);
    console.error(error);
  }
};

useEffect(()=>{
  const updateChatUserData=async()=>{
  if(chatUser){
    const userRef = doc(db,"users",chatUser.userData.id);
    const userSnap= await getDoc(userRef);
    const userData=userSnap.data();
    setChatUser(prev=>({...prev,userData:userData}))
  }
}
updateChatUserData();
},[chatData])

  return (
    <div className={`ls ${chatVisible? "hidden" :""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={(logout)}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          Array.isArray(chatData) &&
          chatData.map((item, index) => (
  <div
    onClick={() => setChat(item)}
    key={index}
    className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <img src={item.userData.avatar} alt="" />
    <div>
      <p>{item.userData.name}</p>
      <span>{item.lastMessage}</span>
    </div>
  </div>
))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
