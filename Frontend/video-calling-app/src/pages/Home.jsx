import React, { useState, useContext } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router";
import "../App.css";
import RestoreIcon from "@mui/icons-material/Restore"
import { Button, TextField, IconButton } from "@mui/material";
import { AuthContext } from "../Context/AuthContext";
import callingImg from "../assets/calling.svg"


 function Home(){
    let navigate = useNavigate();
     const [meetingCode, setMeetingCode ] = useState("");

     
     const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async()=>{
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }
    return(
        <>
           
            <div className="navBar">
                <div style={{display: "flex", alignItems:"center"}}>
                   <h2>My video call</h2>
                </div>
                <div style={{display:"flex", alignItems:"center"}} >
                  
                   <IconButton onClick={
                    ()=>{
                        navigate("/history")
                    }
                   }>
                    <RestoreIcon/>
                  </IconButton>
                   <p>History</p>
                  <Button onClick={()=>{
                    localStorage.removeItem("token")
                    navigate("/auth")
                  }}>
                   Logout
                  </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h3 style={{padding:" 10px"}}>Easy & quality Video Calls</h3>
                        <div style={{display: 'flex', gap:"10px"}}>
                            
                            <TextField onChange={e => setMeetingCode(e.target.value)}  variant="outlined" id="outlined-basic" label="Meeting Code"> </TextField>
                             <Button variant="contained" onClick={handleJoinVideoCall}> JOIN</Button>
                       
                        </div>
                    </div>
                </div>
                <div className="rightPanel">
                    <img src={callingImg} alt="calling" />
                </div>
            </div> 
        </>
    )
}


export default withAuth(Home)