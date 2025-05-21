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
import { db, logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // ✅ added

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.toLowerCase();
      setUser(null);
      setSearchResults([]);

      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const end = input + "\uf8ff";
        const q = query(
          userRef,
          where("username", ">=", input),
          where("username", "<=", end)
        );
        const querySnap = await getDocs(q);

        let results = [];
        querySnap.forEach((docSnap) => {
          const userDoc = docSnap.data();
          if (
            userDoc.id !== userData.id &&
            !chatData.some((u) => u.rId === userDoc.id)
          ) {
            results.push(userDoc);
          }
        });
        setSearchResults(results); // ✅ fixed error
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Search error:", error.message);
    }
  };


const addChat = async (selectedUser) => {
  if (!selectedUser) {
    toast.error("No user selected.");
    return;
  }

  try {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
      createAt: serverTimestamp(),
      messages: [],
    });

    const otherUserChatRef = doc(chatsRef, selectedUser.id);
    const myChatRef = doc(chatsRef, userData.id);

    // Check if chat docs exist, if not create them
    const [myDocSnap, otherDocSnap] = await Promise.all([
      getDoc(myChatRef),
      getDoc(otherUserChatRef),
    ]);

    if (!myDocSnap.exists()) {
      await setDoc(myChatRef, { chatsData: [] });
    }
    if (!otherDocSnap.exists()) {
      await setDoc(otherUserChatRef, { chatsData: [] });
    }

    // Update both users' chat documents
    const chatEntryForOther = {
      messageId: newMessageRef.id,
      lastMessage: "",
      rId: userData.id,
      updatedAt: Date.now(),
      messageSeen: true,
    };

    const chatEntryForMe = {
      messageId: newMessageRef.id,
      lastMessage: "",
      rId: selectedUser.id,
      updatedAt: Date.now(),
      messageSeen: true,
    };

    await updateDoc(otherUserChatRef, {
      chatsData: arrayUnion(chatEntryForOther),
    });

    await updateDoc(myChatRef, {
      chatsData: arrayUnion(chatEntryForMe),
    });

    const uSnap = await getDoc(doc(db, "users", selectedUser.id));
    const uData = uSnap.data();

    setChat({
      messagesId: newMessageRef.id,
      lastMessage: "",
      rId: selectedUser.id,
      updatedAt: Date.now(),
      messageSeen: true,
      userData: uData,
    });

    setShowSearch(false);
    setChatVisible(true);
  } catch (error) {
    toast.error(error.message);
    console.error("Chat creation error:", error);
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

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev) => ({ ...prev, userData: userData }));
      }
    };
    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={logout}>Logout</p>
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
        {showSearch && searchResults.length > 0 ? (
          searchResults.map((usr, index) => (
            <div
              key={usr.id || index}
              onClick={() => {
                setUser(usr);
                addChat(user);
              }}
              className="friends add-user"
            >
              <img src={usr.avatar} alt="" />
              <p>{usr.name}</p>
            </div>
          ))
        ) : (
          Array.isArray(chatData) &&
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`friends ${
                item.messageSeen || item.messageId === messagesId ? "" : "border"
              }`}
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
