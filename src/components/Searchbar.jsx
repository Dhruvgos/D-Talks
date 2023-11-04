import React, { useContext, useState } from 'react'
import { collection, query, where,getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc  } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
function Searchbar() {
  const{dispatch}= useContext(ChatContext)
  const [Username, setUsername] = useState("")
  const [user, setuser] = useState(null)
  const [err,seterr] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const handleSearch = async()=>{
    const ref = collection(db, "users");
    const q = query(ref, where("displayName", "==", `${Username}`));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setuser(doc.data())
  });
      
    } catch (error) {
        seterr(true);
    }

  }
/*
3 collections 
1. user -> where all the user that registered are saved
2. userchats -> where all the chats to second user is done are saved
3. chats -> for all the chats and messages
*/
    const handleKey =(e)=>{
      e.code === "Enter" && handleSearch();
    }
    const handleSelect =async(u)=>{
      //check whether the group (chats ibn firestore )exits ,if not create
      const combinedID = currentUser.uid>user.uid? currentUser.uid + user.uid:user.uid+currentUser.uid;
      const res = await getDoc(doc(db, "chats", combinedID));


      //crreate a chat is chats collection
      if(!res.exists()){
        await setDoc(doc(db,"chats",combinedID),{messages:[]})
      }

      //create user chats
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [combinedID+".userInfo"]:{
          uid:user.uid,
          displayName: user.displayName,
          photoURL : user.photoURL
        },[combinedID+".date"]:serverTimestamp()
      });
      await updateDoc(doc(db,"userChats",user.uid),{
        [combinedID+".userInfo"]:{
          uid:currentUser.uid,
          displayName: currentUser.displayName,
          photoURL : currentUser.photoURL
        },[combinedID+".date"]:serverTimestamp()
      });

    
     dispatch({type:"CHANGE_USER",payload:u})
   


      setuser(null)
      setUsername("")
    }


  return (
    <div className='search'>
        <div className="searchForm">
            <input placeholder='Enter user' onKeyDown={handleKey} onChange={(e)=>setUsername(e.target.value)} value={Username} type="text" />
        
        </div>
        {err && <span>User not found</span>}
    { user && <div className="userChat" onClick={()=>handleSelect(user)}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
            <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Searchbar
