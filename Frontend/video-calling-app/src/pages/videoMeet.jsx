import React, { useEffect, useRef, useState } from "react";
import "../styles/videoMeet.css";
import {TextField,Button} from '@mui/material';
import io from "socket.io-client";
import { Stream } from "nodemailer/lib/xoauth2";



const server_url = "http://localhost:8000/";

var connections ={};

const peerConfigConnections ={
    "iceServers":[
        {"urls": "stun:stun.l.google.com:19302"}
    ]
} 


export default function VideoMeet(){

     var socketRef = useRef();
     let socketIdRef = useRef();
    
     let localVideoRef = useRef();

     let [videoAvailable, setVideoAvailable] = useState(true);

     let [ audioAvailable, setAudioAvailable] = useState(true);

     let  [video, setVideo] = useState([]);

     let [audio, setAudio] = useState();

     let [screen, setScreen] = useState();

     let [showModal, setShowModal ]= useState();

     let [screenAvailable, setScreenAvailable] = useState();

     let [messages, setMessages] = useState([]);

     let[ message, setMessage] = useState("");

     let [newMessages, setNewMessages ]= useState(0);

     let [askForUsername, setAskForUsername] = useState(true);

     let[ username, setUsername] = useState("");

     const videoRef = useRef([]);

     let[ videos, setVideos] = useState([]);

//todo

// if(isChrome()=== false){}

const getPermissions = async () => {
    try {
        let hasVideo = false, hasAudio = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            hasVideo = true;
            hasAudio = true;
            stream.getTracks().forEach(t => t.stop()); // stop the test stream
        } catch {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                hasVideo = true;
            } catch {}
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                hasAudio = true;
            } catch {}
        }

        setVideoAvailable(hasVideo);
        setAudioAvailable(hasAudio);
        setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

        if (hasVideo || hasAudio) {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({
                video: hasVideo,
                audio: hasAudio
            });
            window.localStream = userMediaStream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = userMediaStream;
            }
        }
    } catch (err) {
        console.error("Permission error:", err);
    }
};

useEffect(()=>{
    getPermissions();

}, [])

let getUserMediaSuccess = (stream)=>{

}


let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio || audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video, audio: audio})
        .then(getUserMediaSuccess)
        .then((stream)=>{})
        .catch((e)=> console.log(e))

    }else{
        try{
               let tracks = localVideoRef.current.srcObject.getTracks();
             tracks.forEach(track => track.stop())
       
            }catch(e){}
         
        
    }
}


useEffect(() =>{
    if(video !== undefined && audio !== undefined ){
        getUserMedia();
    }
},[audio , video]);

//todo 
let gotMessageFromServer = (fromId, message) =>{

}


let connectToSocketServer = ()=>{
    socketRef.current = io.connect(server_url , {secure: false})
   
    socketRef.current.on("signal", gotMessageFromServer
    );

    socketRef.current.on("connect", () => {
       socketRef.current.emit("join-call",window.location.href)
      
       socketIdRef.current = socketRef.current.id

       socketRef.current.on("chat-message", addMessage)

       socketRef.current.on("user-left",(id)=>{
        setVideo((videos)=>videos.filter((video)=>video.socketId !== id))
       })

       socketRef.current.on("user-joined",( id, clients) =>{
        clients.forEach((socketListId)=>{

connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
connections[socketListId].onicecandidate = (event) =>{
    if(event.candidate !== null){
        socketRef.current.emit("signal",socketListId, JSON.stringify({'ice': event.candidate}))
    }
}
connections[socketListId].onaddstream = (event) =>{

let videoExists = videoRef.current.find(video => video.socketId === socketListId)


    if(videoExists){
     setVideo(videos =>{
        const updateVideos = videos.map(video =>{
            video.socketId === socketListId ? {...video, stream:event.stream} : video
        });
     })
    }
    

}
        })
       })
    });

   
}

let getMedia = () =>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
}

let connect = ()=>{
    setAskForUsername(false);
    getMedia();
}


    return(<div>
       {askForUsername === true?
          <div>
             <h2>Enter into lobby </h2>
                 <TextField 
                       id="outlined-basic" 
                       label="Username" 
                       variant="outlined"  
                       value={username} 
                       onChange={e=>setUsername(e.target.value)}
                  />
              <Button variant="contained" onClick={connect}>Connect</Button>

<div>
    <video autoPlay muted ref={localVideoRef}></video>
</div>

            </div>
    
    
    :
    <div></div>  
    
    }
      
       </div>
    )
} 