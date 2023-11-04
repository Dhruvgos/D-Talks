import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { useChat } from "../Context/SharedContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { chats, setchats } = useChat();

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  
  }, [message]);
  // console.log(currentUser.uid)
  // console.log(message.senderId)

  return (
    <div
      ref={ref}
      className={`message ${message.senderId == currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
       { message.text?<p>{message.text}</p>:null}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;