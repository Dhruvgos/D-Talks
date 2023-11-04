import React, { useContext, useEffect } from 'react'
import Messages from './Messages'
import Input from './Input'
import video from '../images/video.png';
import { ChatContext } from '../Context/ChatContext'
import { useState } from 'react'
import { useChat } from '../Context/SharedContext'
import Call from './Call'
import { useNavigate } from 'react-router-dom'

function Chat() {
  const navigate = useNavigate()
  const { data } = useContext(ChatContext);
  const [first, setfirst] = useState(false);
  const { showChat, setshowChat } = useChat();
  const { called, setcalled } = useChat();

  const handleclick = () => {
    navigate('call');

  }

  console.log(showChat)
  return (
    <div className='chat'>
      <div className="topbar">

        {/* <button >Logout</button> */}
        <div className='r_profile'>
          {data.user?.photoURL ? <img id='r_user' src={data.user?.photoURL
          } alt="" /> : null}
          <span>{data.user?.displayName}
          </span></div>
        <div className="chatIcons">
          {/* <img width="24" height="24" src="https://img.icons8.com/color/48/add-user-female.png" alt="add-user-female" /> */}
          {showChat && <img src={video} onClick={handleclick} width="24" height="24" alt="video-call" />
          }          
          {/* <img width="24" height="24" src="https://img.icons8.com/ios-filled/50/40C057/more.png" alt="more"/>             */}
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
