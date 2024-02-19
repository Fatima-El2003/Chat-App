import React, { useContext, useEffect, useState } from "react";
import Message from './Message'
import { ChatContext } from "../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
const Messages = () => {

  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  //to fetch messages from chats collection
  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages);//chats collection contains messages so if there is any messages fetch them
    });
    return ()=>{
      unsub();
    }
  },[data.chatId])
  return (
    <div className='messages'>
      {messages.map((m) =>(
        <Message message = {m} key={m.id} /> //message here is a prop, we always need to specify a unique key
      ))}
    </div>
  )
}

export default Messages