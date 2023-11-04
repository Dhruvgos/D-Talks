import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  doc,getDoc,updateDoc ,arrayUnion,Timestamp,serverTimestamp
} from 'firebase/firestore';
import { useContext } from 'react';
import { v4 as uuid } from "uuid";
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';


function Call() {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  // const [callStarted, setCallStarted] = useState(false);
  const webcamVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const inputRef = useRef(null);
  const answerButtonref  =useRef(null);
  const [text, setText] = useState("");
  const [callButtonDisabled, setCallButtonDisabled] = useState(false);
  const [answerButtonDisabled, setAnswerButtonDisabled] = useState(true);
  const [hangupButtonDisabled, setHangupButtonDisabled] = useState(true);
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const pc = new RTCPeerConnection(servers);

  const makeCall = async () => {
    await startCam()
    const callDoc = await addDoc(collection(db, 'calls'), {});

    const callDocId = callDoc.id;
    console.log( typeof callDocId )
    console.log( typeof callDoc.id )
    // setText(callDocId)
    const offerCandidates = collection(
      doc(db, 'calls', callDocId),
      'offerCandidates'
    );
    const answerCandidates = collection(
      doc(db, 'calls', callDocId),
      'answerCandidates'
    );

    inputRef.current.value = callDoc.id;
      // console.log(callDoc.id)
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text:`Join the vedio call with ${currentUser.displayName} with this ID : `+callDocId,
        senderId: currentUser.uid,
        date: Timestamp.now()
      }),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text:`Join the vedio call with ${currentUser.displayName} with this ID : `+callDocId,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text:`Join the vedio call with ${currentUser.displayName} with this ID : `+callDocId
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

      

    pc.onicecandidate = async (e) => {
      if(e.candidate){

        await addDoc(offerCandidates, e.candidate.toJSON());
        console.log('Offer Candidate added:', e.candidate);
      }

    };

    // create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      // check if local peer has already configured with remote peer's sdp
      if (!pc.currentRemoteDescription && data.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      // whenever a new ice candidate of the remote peer is added in answerCandidates, add that candidate in the peer connection
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    // setcall(true)
    setCallButtonDisabled(true);
    setAnswerButtonDisabled(true);
    setHangupButtonDisabled(false);


    console.log('everything running fine');
  };
//  if( inputRef.current){
//   answerButtonref.disabled = false;
//  }

const answerCall = async () => {
    await startCam()
  const callId = inputRef.current.value;

  try {
    const callDoc = doc(db, "calls", callId);
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    pc.onicecandidate = async (e) => {
      if (e.candidate) {
        await addDoc(answerCandidates, e.candidate.toJSON());
        console.log('Answer Candidate added:', e.candidate);
        
      }
    }

    const callData = (await getDoc(callDoc)).data();

    if (callData && callData.offer) {
      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
      }

      await updateDoc(callDoc,{answer})
      // After successfully setting the remote description, add an event listener to handle offer candidates
      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });

      // You may want to update component state to enable the Hangup button
      // For example, if using React, you can use `useState` and `setState`.
    } else {
      console.error('No offer data found in the call document.');
    }
  } catch (error) {
    console.error('An error occurred while answering the call:', error);
  }
  setAnswerButtonDisabled(true);
  setHangupButtonDisabled(false);
}



  const startCam = async () => {

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track)

      });
    };

    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  ;
  
    ;
  };

  const hangCall = async()=>{
    pc.close();

    // Clear video streams
    if (webcamVideoRef.current.srcObject) {
      const stream = webcamVideoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (remoteVideoRef.current.srcObject) {
      const stream = remoteVideoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    setCallButtonDisabled(false);
    setAnswerButtonDisabled(false); // Enable the Answer button
    setHangupButtonDisabled(true);

    webcamVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;

  }

  return (
    <div className="home">

    <div className='vediocomponent'>
      <div className='videos'>
        <div className='vedio'>
          <h3>{currentUser.displayName}</h3>
          <video
            ref={webcamVideoRef}
            id='webcamVideo'
            autoPlay
            playsInline
            ></video>
            
        </div>
        
        <div className='vedio'>
          <h3>{data.user.displayName}</h3>
          <video
            ref={remoteVideoRef}
            id='remoteVideo'
            autoPlay
            playsInline
            ></video>
        </div>
        <div className='btncomp'>
        <input onChange={()=>{setAnswerButtonDisabled(false)}} placeholder='Enter the ID to join the call' ref={inputRef} id='callInput' />
        <button
  disabled={callButtonDisabled}
  onClick={makeCall}
  id="cameraOn"
>
  Call
</button>

<button
  disabled={answerButtonDisabled}
  ref={answerButtonref}
  onClick={answerCall}
  id="answerButton"
>
  Answer
</button>

<button
    onClick={hangCall}
  disabled={hangupButtonDisabled}
  id="hangupButton"
>
  Hangup
</button>

      </div>
      </div>
      
    </div>
        </div>
  );
}

export default Call;
