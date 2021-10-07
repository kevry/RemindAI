import React from 'react';
import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./MainScreen.css"
import Nav from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

import addNotification from 'react-push-notification';


class MainScreen2 extends React.Component {

    constructor(){
        super();
    }

    render() {
        return(
            <>
            <div className="container">
                <Nav />

                <audio className="audio-element">
                    <source src={ding}></source>
                </audio>

                <div className="header">
                    <h4> Using Deep Learning to </h4>
                    <h4> prevent back-pain and improve </h4>
                    <h4> physical health while working</h4>
                    <p> Remind A.I. reminds user's to stand when sitting for prolonged periods of time</p>
                </div>

                <div className="main-body">
                    <div className="user-interaction">

                        <div className="webCam-section">
                            {webcamEnabled ? (
                                <div className="webcamContainer">
                                    <button className="button-exit-cam" onClick={enableWebcam}>
                                        x
                                    </button>
                                    <Webcam
                                        className="webcamFootage"
                                        audio={false}
                                        mirrored={true}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        width="400"
                                        height="320"
                                    />
                                </div>
                            ):(
                                <div className="webcam-button-container">
                                    <button className="webcamButton" type="button" onClick={enableWebcam}>
                                        Enable webcam
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className = "settings">
                            <p> Customize settings to begin</p>

                            <label>Sitting limit (seconds): </label>
                            <br></br>
                            <input disabled={disabledState} placeholder= "Enter here" name="standInterval" type="number" min="5" max="60" onChange={handleChange}></input>

                            <br></br>
                            <label>Alarm and/or notification after limit has been reached: </label>
                            <br></br> 

                            <div className="checkbox-row">
                                <div className="label-div">
                                    <label className = "checkL">Alarm: </label>
                                </div>
                                
                                <div className="input-div">
                                    <input disabled={disabledState} className = "checkB" name="alarmSelect" type="checkbox" onChange={alarmChange} />
                                </div>
                                
                            </div>

                            <div className="checkbox-row">
                                <div className="label-div">
                                    <label className = "checkL">Notification: </label>
                                </div>

                                <div className="input-div">
                                    <input disabled={disabledState} className = "checkB" name="notificationSelect" type="checkbox" onChange={notificationChange}/>
                                </div>
                            </div>

                            <div className="error-message">
                                <p>
                                    {errorMessage}
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="startButton" >
                        {!currentState ? (
                            <button  className="button-start"onClick={capture}>Start</button>
                        ):(
                            <button  className="button-end" onClick={endCapture}>End</button>
                        )}        
                    </div>

                </div>

                <div className="footer-location">
                    <Footer/>
                </div>
            
            </div>

        </>
        );
    }





}