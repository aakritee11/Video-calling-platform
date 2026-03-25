import React from "react";
import "../App.css";


export default function Landing(){
    return(
        <div className="landingPageContainer"
        >
            <nav>
                <div className="navHeader">
                    <h2>Virtual,but real.</h2>
                </div>
                <div className="nav-list">
                    <p> Join as guest</p>
                    <p>Register</p>
                    <div role="button">
                        <p>Login</p>
                    </div>
                </div>
            </nav>
           
<div className="landingMainContainer">
    <div>
        <h1> <span style={{color:"#FFA500"}}>Connect </span>with more people.</h1>
    </div>
</div>

        </div>
    )
}