import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext } from 'react'
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
// import { useState } from "react";
import { useEffect } from "react";
import { useChat } from "../Context/SharedContext";
import { db } from "../firebase";
function Chats() {
  const { data} = useContext(ChatContext);

    const { currentUser } = useContext(AuthContext)
    const {dispatch} = useContext(ChatContext);
    const { chats, setchats } = useChat();
    const {  showChat, setshowChat} = useChat();
   const{ isDisabled, setIsDisabled} = useChat();

// console.log("current user : ",currentUser.uid)
    useEffect(() => {
      if (currentUser?.uid) { // Check if currentUser.uid is defined
        const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
          setchats(doc.data());
        });
        
        // Cleanup the listener when the component unmounts
        return () => {
          unsubscribe();
        };
      }
    //   else {
    //     // Clear chats data if there is no user (user logged out)
    //     setchats([]);
    // }
    }, [currentUser.uid]); // Add a dependency on currentUser?.uid
    
    // console.log(chats)
    const handleSelect=(u)=>{
        dispatch({type:"CHANGE_USER",payload:u})
        setshowChat(true);
        setIsDisabled(false);
        console.log(data.user)
    }

    
    return (
        <div className='chats'>
            {/* <button >Logout</button> */}
         {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
  <div
    className="userChat"
    key={chat[0]} // Use chat[0] for the user ID
    onClick={() => handleSelect(chat[1].userInfo)} // Use chat[1] to access user data
  >
    <img src={chat[1]?.userInfo?.photoURL} alt="" />
    <div className="userChatInfo">
      <span>{chat[1]?.userInfo?.displayName}</span>
      <p>{chat[1]?.lastMessage?.text}</p>
    </div>
  </div>
))}

        </div>
      );
      
}

export default Chats
