import { signOut } from 'firebase/auth';
import React, { useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { AuthContext } from '../Context/AuthContext';
import { useChat } from '../Context/SharedContext';
import { ChatContext } from '../Context/ChatContext';
function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const { messages, setmessages } = useChat();
  const {  showChat, setshowChat} = useChat();
  const{dispatch}= useContext(ChatContext)
  const logout = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch the "LOGOUT" action
    setmessages([]); // Clear messages
    setshowChat(false)
    signOut(auth); // Sign out the user
  }
  
  // Log the state changes when messages is updated
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className='navbar'>
      <span className='logo'>D-
      <span style={{color:'rgb(79 197 207)'}}>T</span>
      alks</span>

      <div className="user">
        <div className="profile">

        <img src={`${currentUser.photoURL}`} alt="" />
        <span>{`${currentUser.displayName}`}</span>
        </div>
        <div className="btn">

        <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
