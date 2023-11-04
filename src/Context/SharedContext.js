// ChatContext.js
import React, { createContext, useContext, useState } from 'react';

const SharedContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setchats] = useState([]); // Initialize with your initial value
  const [messages, setmessages] = useState([])
  const [showChat, setshowChat] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true);
  const [called, setcalled] = useState(false)
  

  return (
    <SharedContext.Provider value={{called, setcalled,isDisabled, setIsDisabled,showChat, setshowChat, chats, setchats,messages, setmessages }}>
      {children}
    </SharedContext.Provider>
  );
}

export function useChat() {
  return useContext(SharedContext);
}
