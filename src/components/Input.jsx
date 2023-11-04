import React, { useContext, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useChat } from "../Context/SharedContext";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const {isDisabled, setIsDisabled} = useChat();
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  console.log(data.user)
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error); // Log any errors during image upload
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input  disabled={isDisabled}
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <label  htmlFor="file">
        {/* <img style={{display:'none'}} src="" alt="" /> */}
        
<svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="35px" height="35px"><radialGradient id="nw2JPvgEzDKQpjWgMaZM5a" cx="48.477" cy="36.475" r="22.942" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#bd8af5"/><stop offset=".137" stop-color="#b88bf5"/><stop offset=".309" stop-color="#a88ff3"/><stop offset=".499" stop-color="#8f96f2"/><stop offset=".702" stop-color="#6b9eef"/><stop offset=".913" stop-color="#3eaaec"/><stop offset="1" stop-color="#29afea"/></radialGradient><path fill="url(#nw2JPvgEzDKQpjWgMaZM5a)" d="M40,6H8C6.895,6,6,6.895,6,8v32c0,1.105,0.895,2,2,2h32c1.105,0,2-0.895,2-2V8	C42,6.895,41.105,6,40,6z"/><path fill="#436dcd" d="M32.065,23.065c-1.149-1.149-3.005-1.174-4.185-0.057L18,32.368V42h22c1.105,0,2-0.895,2-2v-7	L32.065,23.065z"/><circle cx="30.5" cy="14.5" r="3.5" fill="#fff"/><linearGradient id="nw2JPvgEzDKQpjWgMaZM5b" x1="23.91" x2="23.91" y1="18.133" y2="42.415" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#124787"/><stop offset=".923" stop-color="#173b75"/><stop offset="1" stop-color="#173a73"/></linearGradient><path fill="url(#nw2JPvgEzDKQpjWgMaZM5b)" d="M8,42h32c0.811,0,1.507-0.485,1.82-1.18L20.065,19.065c-1.149-1.149-3.005-1.174-4.185-0.057	L6,28.368V40C6,41.105,6.895,42,8,42z"/></svg>
        <input disabled={isDisabled}
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};



export default Input
