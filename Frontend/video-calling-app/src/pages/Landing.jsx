import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import "../App.css";
import videoCall from "../assets/videoCall.avif";



export default function Landing(){
    const router = useNavigate();
    return(
        <div className="landingPageContainer"
        >
            <nav>
                <div className="navHeader">
                    <h2>Virtual,but real.</h2>
                </div>
                <div className="nav-list">
                    <p onClick={()=>{
                      router("/we12");
                    }}>  Join as guest</p>
                    <p 
                     onClick={()=>{
                        router("/auth");
                     }}
                    >Register</p>
                    <div role="button"
                     onClick={()=>{
                        router("/auth");
                     }}
                    >
                        <p>Login</p>
                    </div>
                </div>
            </nav>
           
<div className="landingMainContainer">
    <div>
        <h1> <span style={{color:"#FFA500"}}>Connect </span>with more people.</h1>
        <p>Cover the distance with video calls.</p>
        <div role="button">
           <Link to={"/auth"}>Get Started</Link>
        </div>
    </div>
    <div>
        <img src={videoCall} alt="" />
    </div>
</div>

        </div>
    )
}