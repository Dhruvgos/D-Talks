import React, { useContext, useState } from 'react'
// import { useState } from 'react'
import Message from './Message'
import { ChatContext } from '../Context/ChatContext'
import { useEffect } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { doc } from 'firebase/firestore'
import { AuthContext } from '../Context/AuthContext'
import { signOut } from 'firebase/auth'
import { useChat } from '../Context/SharedContext'

function Messages() {

  const {currentUser} = useContext(AuthContext);
  const {  showChat, setshowChat} = useChat();
  const{data} = useContext(ChatContext)
  // const [messages, setmessages] = useState([])
  const { messages, setmessages } = useChat();
  // console.log(currentUser.uid)
  console.log(data.chatId)
  useEffect(()=>{
 
      onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
        
        doc.exists() && setmessages(doc.data().messages)
        
       })
      
      
   
  },[data.chatId])
// console.log(messages)
  return (
<div className={`messages ${showChat ? "" : "messagesf"}`}>
     { showChat?messages.map((m) => (
      <Message message={m} key={m.id} />
    )):<p style={{color:'lightgray'}}>Please first select a chat to talk...</p>}
  </div>
  )
}

export default Messages
