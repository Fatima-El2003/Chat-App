import React, { useContext, useState, useEffect } from "react";
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
  onSnapshot
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypinng, setIsTypinng] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          try {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  read: false,
                  img: downloadURL,
                }),
              });
            });
          } catch (e) {
            // Caught an exception from Firebase.
            console.log("Failed with error '${e.code}': ${e.message}");
          }

        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          read: false
        }),
      });
    }
    await updateDoc(doc(db, "usersChat", currentUser.uid), {
      [data.chatId + ".lastMessage"] : {
        text,
      },
      [data.chatId + ".date"] : serverTimestamp(),
    })
    await updateDoc(doc(db, "usersChat", data.user.uid), {
      [data.chatId + ".lastMessage"] : {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };

  const handleKeyDown = () => {
    clearTimeout(typingTimer); // Reset timer
    const newTimer = setTimeout(() => {
      // Update typing status in database
      updateTypingStatus(false);
    }, 2000); // 2 seconds debounce
    setTypingTimer(newTimer); // Set new timer
    updateTypingStatus(true);
  };

  const updateTypingStatus = async (typing) => {
    const TypingId = data.chatId; // Replace with the actual chat ID
    const userId = currentUser.uid; // Replace with the actual user ID
    const chatRef = doc(db, 'TypingStatus', TypingId);
    await setDoc(chatRef, {
      [userId]: typing
    }, { merge: true });
  };

  useEffect(() => {
    const TypingId = data.chatId; // Replace with the actual chat ID
    const chatRef = doc(db, 'TypingStatus', TypingId);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const isOtherUserTyping = Object.keys(data).some(key => key !== currentUser.uid && data[key] === true);
        setIsTyping(isOtherUserTyping); //to update is typing with the new value asynchronously we must put it in the argument of useEffect
      }
    });
    return () => unsubscribe();
  }, [data.chatId, currentUser.uid, db, isTyping]);


  return (
    <div>
      {isTyping && (
        <div style={{display:'flex', alignItems:'center',margin:'0'}}>
          <p className="typing-animation" style={{ marginBottom: '-20px', marginTop: '0px', marginLeft: '10px' }}>
          {data.user.displayName} is typing ...
          </p>
        </div>

)}

    <div className="input">
      
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
    </div>
  );
};
export default Input;