import React, { useEffect, useRef, useState } from "react";
import {TextField,Button, IconButton, Badge, Modal } from '@mui/material';
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import styles from "../styles/videoMeet.module.css"
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare"
import ChatIcon from "@mui/icons-material/Chat"
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import server from "../environment";



const server_url = server;

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

     let  [video, setVideo] = useState(false);

     let [audio, setAudio] = useState(false);

     let [screen, setScreen] = useState();

     let [showModal, setShowModal ]= useState(true);

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
   try{
    
    window.localStream.getTracks().forEach(track=> track.stop())

   }catch(e){console.log(e)}

   window.localStream = stream;
   localVideoRef.current.srcObject = stream;

   for(let id in connections){
    if(id == socketIdRef.current) continue;

    window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});

    connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description)
        .then(()=>{
            socketRef.current.emit("signal", id, JSON.stringify({"sdp": connections[id].localDescription}))
        }).catch(e => console.log(e))
    })

     
   }
  stream.getTracks().forEach(track => track.onended = ()=>{
    setVideo(false);
    setAudio(false);

    try{
        let tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
    }catch(e){console.log(e)}
// todo blacksilence

   let blackSilence = (...args)=> new MediaStream([black(...args), silence()]);
           window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;


  for(let id in connections){
    window.localStream.getTracks().forEach(track => {
    connections[socketListId].addTrack(track, window.localStream);
});
    connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description)
        .then(()=>{
            socketRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}))
        }).catch(e => console.log(e))
    })
 }
   })
}

let silence = ()=>{
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0],{enabled: false})
}

let black = ({width = 640, height= 480} ={})=>{
         let canvas = Object.assign(document.createElement("canvas"),{width,height});

         canvas.getContext('2d').fillRect(0,0,width, height);
         let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0],{enabled : false})
} 



let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
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
  var signal = JSON.parse(message)

  if(fromId !== socketIdRef.current){
    if(signal.sdp){
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
            if(signal.sdp.type == "offer"){

                connections[fromId].createAnswer().then((description)=>{
                    connections[fromId].setLocalDescription(description).then(()=>{
                        socketRef.current.emit("signal", fromId, JSON.stringify({"sdp": connections[fromId].localDescription})
                    )
                    }).catch(e=> console.log(e))
                }).catch(e=>console.log(e))
            }
        }).catch(e=>console.log(e))
    }
    if(signal.ice ){
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch(e=>console.log(e))
    }
  }
}

let addMessage = (data, sender , socketIdSender )=>{
  setMessages((prevMessages)=>[
    ...prevMessages,
    {sender: sender, data: data}
  ]);

  if(socketIdSender !== socketIdRef.current){
    setNewMessages((prevMessages)=> prevMessages +1)
  }
}

let connectToSocketServer = ()=>{
    socketRef.current = io.connect(server_url ,
         {secure: false,
            withCredentials: true,
            transports : ["websocket", "polling"]
         })
   
    socketRef.current.on("signal", gotMessageFromServer
    );

    socketRef.current.on("connect", () => {
       socketRef.current.emit("join-call",window.location.href)
      
       socketIdRef.current = socketRef.current.id

       socketRef.current.on("chat-message", addMessage)

       socketRef.current.on("user-left",(id)=>{
        setVideos((videos)=>videos.filter((video)=>video.socketId !== id))
       })

       socketRef.current.on("user-joined",( id, clients) =>{
        clients.forEach((socketListId)=>{

      if(socketListId == socketIdRef.current) return;
      if(connections[socketListId]) return;


      connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
      connections[socketListId].onicecandidate = (event) =>{
        if(event.candidate !== null){
        socketRef.current.emit("signal",socketListId, JSON.stringify({'ice': event.candidate}))
         }
}
connections[socketListId].ontrack = (event) => {
    const remoteStream = event.streams[0];
    if (!remoteStream) return;

    const existing = videoRef.current.find(v => v.socketId === socketListId);
    if (existing) {
        setVideos(prev => {
            const updated = prev.map(v =>
                v.socketId === socketListId ? { ...v, stream: remoteStream } : v
            );
            videoRef.current = updated;
            return updated;
        });
        return; 
    }

    setVideos(prev => {
        if (prev.find(v => v.socketId === socketListId)) return prev;
        const updated = [...prev, { socketId: socketListId, stream: remoteStream }];
        videoRef.current = updated;
        return updated;
    });
};


if (window.localStream) {
    window.localStream.getTracks().forEach(track => {
        connections[socketListId].addTrack(track, window.localStream);
    });
} else {
    let bs = new MediaStream([black(), silence()]);
    window.localStream = bs;
    bs.getTracks().forEach(track => {
        connections[socketListId].addTrack(track, bs);
    });
}
 if(window.localStream !== undefined && window.localStream !== null ){
           window.localStream.getTracks().forEach(track => {
    connections[socketListId].addTrack(track, window.localStream);
});
        }else{
           
           let blackSilence = (...args)=> new MediaStream([black(...args), silence()]);
           window.localStream = blackSilence();
           window.localStream.getTracks().forEach(track => {
    connections[socketListId].addTrack(track, window.localStream);
});
            
        }
        })
       
        if(id == socketIdRef.current){
            for (let id2 in connections){
                if(id2 == socketIdRef.current) continue

                try{
                    window.localStream.getTracks().forEach(track => {
    connections[id2].addTrack(track, window.localStream);
});
                }catch{(e)=>console.log(e)}

                connections[id2].createOffer().then((description)=>{
                    connections[id2].setLocalDescription(description)
                    .then(()=>{
                        socketRef.current.emit("signal", id2 , JSON.stringify({"sdp": connections[id2].localDescription}))
                    })
                    .catch(e=> console.log(e))
                })
            }
        }

       })
    });

   
}

let getMedia = () =>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
}

let routeTo = useNavigate();

let connect = ()=>{
    setAskForUsername(false);
    getMedia();
}

let handleVideo =()=>{
    setVideo(!video);
}

let handleAudio =()=>{
    setAudio(!audio);
}

let getDisplayMediaSuccess = (stream)=>{
    try{
     window.localStream.getTracks().forEach(track => track.stop())
    }catch(e){
   console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for(let id in connections){
        if(id=== socketIdRef.current) continue;

       window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});
         connections[id].createOffer().then((description)=>[
            connections[id].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit("signal", id, JSON.stringify({"sdp": connections[id].localDescription}))
            })
            .catch((e)=> console.log(e))
         ])
    }
     stream.getTracks().forEach(track => track.onended = ()=>{
    setScreen(false);

    try{
        let tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
    }catch(e){console.log(e)}
// todo blacksilence

   let blackSilence = (...args)=> new MediaStream([black(...args), silence()]);
           window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;


       getUserMedia();
   })
}

let getDisplayMedia = ()=>{
    if(screen){
        if(navigator.mediaDevices.getDisplayMedia){
           navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
            .then(getDisplayMediaSuccess)
            .then((stream)=>{})
            .catch((e)=> console.log(e));
    }}
}

useEffect(()=>{
    if(screen !== undefined)
        getDisplayMedia();
},[screen])

let handleScreen =()=>{
    setScreen(!screen);
}

let sendMessage = ()=>{
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
}


    let handleEndCall = () => {
    try {
        
        localVideoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
    } catch (e) {}

    try {
       
        window.localStream?.getTracks().forEach(track => track.stop());
        window.localStream = null;
    } catch (e) {}

    try {
       
        for (let id in connections) {
            connections[id].close();
            delete connections[id];
        }
    } catch (e) {}

    try {
       
        socketRef.current?.disconnect();
    } catch (e) {}

    routeTo("/home");
};

useEffect(() => {
    return () => {
       
        try {
            window.localStream?.getTracks().forEach(track => track.stop());
            window.localStream = null;
        } catch (e) {}

        try {
            for (let id in connections) {
                connections[id].close();
                delete connections[id];
            }
        } catch (e) {}

        try {
            socketRef.current?.disconnect();
        } catch (e) {}
    };
}, []);

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
    <div className={styles.meetVideoContainer}>
       
      { showModal? <div className={styles.chatRoom}>
        <div className={styles.chatContainer  }>
             <h2>Chat</h2>

             <div className={styles.chattingDisplay}>
                {messages.map((item,index)=>{
                   return(
                    <div style={{marginBottom :"20px"}} key = {index}>
                       <p style={{fontWeight: "bold"}}>{item.sender}</p>
                       <p>{item.data}</p>
                    </div>
                   )
                })}
             </div>
        
        
         <div className={styles.chattingArea}>
             <TextField value={message} onChange={e=> setMessage(e.target.value)} label="Enter your Message" id="outlined-basic"  variant="outlined" />
             <Button variant="contained" onClick={sendMessage} >Send</Button>

         </div>
     
        </div>
    </div> : <></>}


       <div className={styles.buttonContainers}>

          <IconButton onClick={handleVideo} style={{color:"white"}}>
            {(video===true)?<VideocamIcon/> : <VideocamOffIcon/>}
          </IconButton>

          <IconButton onClick={handleEndCall} style={{color:"red"}}>
             <CallEndIcon />
          </IconButton>

          <IconButton onClick={handleAudio} style={{color:"white"}}>
            {audio===true ?<MicIcon/> : <MicOffIcon/>}
          </IconButton>

          {screenAvailable === true ?
            <IconButton onClick={handleScreen} style={{color:"white"}} >
            {screen=== true?<ScreenShareIcon/> : <StopScreenShareIcon/>}
          </IconButton>  
         : <></>}

           <Badge badgeContent = {newMessages} max={999} color="primary">
             <IconButton onClick={()=> setShowModal(!showModal)} style={{color:"white"}}>
              {/* {Modal=== true? <ChatIcon/>: <SpeakerNotesOffIcon/>}  */}
              <ChatIcon/>
             </IconButton>

           </Badge>

       </div>
       
        <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted></video>
       
        <div className={styles.conferenceView}>
            {videos.map((video)=>(
            <div 
            
            key = {video.socketId}>
             
             <video 
             data-socket = {video.socketId}
             ref={ref =>{
              if(ref && video.stream){
                ref.srcObject = video.stream;
              }
             }}
             autoPlay


             ></video>

            </div>
        ))}
        </div>
    </div>  
    
    }
      
       </div>
    )
}