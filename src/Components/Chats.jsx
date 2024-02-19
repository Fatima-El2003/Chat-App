import { doc, onSnapshot, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "usersChat", currentUser.uid), (doc) => {
        if (doc.exists) {
          setChats(doc.data());
        } else {
          // Handle the case where the document doesn't exist
          console.log("Document does not exist");
        }
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);


  const handleSelect = async (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    
    console.log("User UID:", u.uid); // Log user UID for debugging

    const q = query(
        collection(db, "chats"),
        where("messages.senderId", "==", u.uid),
        where("messages.read", "==", false)
    );

    try {
        const querySnapshot = await getDocs(q);
        console.log("Query Snapshot:", querySnapshot); // Log query snapshot for debugging

        querySnapshot.forEach(async (doc) => {
            const docRef = doc.ref;
            await updateDoc(docRef, {
                read: true,
            });
            console.log("Document updated:", doc.id); // Log document ID for debugging
        });
    } catch (error) {
        console.error("Error updating documents:", error); // Log any errors
    }
};


  

  return (
<div className="chats">
  {chats === null ? (
    <p>Loading...</p>
  ) : (
    Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => {
      const messageDate = chat[1].date?.toDate();
      const formattedDate = `${messageDate?.getFullYear()}-${(messageDate?.getMonth() + 1).toString().padStart(2, '0')}-${messageDate?.getDate().toString().padStart(2, '0')}`;
      return (
        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <div className="lastMessageContainer"> {/* Container for last message and date */}
              <p>{chat[1].lastMessage?.text}</p>
              <p className="messageDate">{formattedDate}</p>
            </div>
            <p className="notification"></p>
          </div>
        </div>
      )
    })
  )}
</div>

  );
};

export default Chats;