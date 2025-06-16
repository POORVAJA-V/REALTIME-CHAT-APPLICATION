import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData} = useContext(AppContext);


 const handleProfileUpdate = async (event) => {
  event.preventDefault();
  try {
    if (!prevImage && !image) {
      toast.error("Please upload a profile image");
      return;
    }

    const docRef = doc(db, 'users', uid);

    if (image) {
      const imgUrl = await upload(image);
      setPrevImage(imgUrl);
      await setDoc(docRef, {
        avatar: imgUrl,
        bio: bio,
        name: name,
      }, { merge: true });
    } else {
      await setDoc(docRef, {
        bio: bio,
        name: name,
      }, { merge: true });
    }

    const snap = await getDoc(docRef);
    setUserData(snap.data());
    navigate('/chat');
  } 
  catch (error) {
    console.error("Error in profile update:", error);
    toast.error(error.message);
  }
}


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleProfileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept="image/png , image/jpeg, image/jpg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="write profile bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
