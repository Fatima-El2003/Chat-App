import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import addAvatar from '../images/addAvatar.png';

const Register = () => {
  const [err,setErr] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];  
    try {
      //creaing user
      const response = await createUserWithEmailAndPassword(auth, email, password); 
      // The name of images in storage cloud
      const storageRef = ref(storage, displayName);
      //uploading file to storage
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try{
            await updateProfile(response.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            //create user chats
            await setDoc(doc(db, "usersChat", response.user.uid), {
              
            })
          } catch(err){
            console.log(err);
            setErr(true);
          }
        });
      });
    } catch(err){
      setErr(true);
    }
  };
  
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chattie</span>
        <span className="title">Register</span>
        <form onSubmit = {handleSubmit}>
          <input required type="text" placeholder="Username" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={addAvatar} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err&& <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to = "/Login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register