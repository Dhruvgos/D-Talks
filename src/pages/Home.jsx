import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import Call from '../components/Call'
import { useChat } from '../Context/SharedContext'
function Home() {
  const {  called, setcalled} = useChat();
  return (
    <div className='home'>
        <div className="container">

      {(!called)?<Sidebar/>:null}
      {(!called)?<Chat/>:null}
      {/* <Chat/> */}
        {/* <Call/> */}
      {/* <Call/> */}
        </div>
    </div>
  )
}

export default Home
