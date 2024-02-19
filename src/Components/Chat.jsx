import React, { useContext, useState, useEffect  } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../Context/ChatContext";


import Typing from "./Typing";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="user">
          {data.user && <img src={data.user.photoURL} />}
          <span>{data.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      
      <Input/>
    </div>
  );
};

export default Chat;