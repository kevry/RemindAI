import React from 'react';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import app from "../../base"
import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./Home.css"
import HomeNavbar from "./HomeNavBar/HomeNavBar"


const MainScreen = ({history}) => {

    var count = 0

    //WEBCAME STATE
    const [webcamEnabled, setwebCam]= React.useState(false);

    //STAND INTERVAL GIVEN BY INPUT
    const [standInterval, setStandInterval] = React.useState(null);

    //ALARM+NOTIFICATION CHOICES
    const [alarmChoice, setAlarm]= React.useState(false);
    const [notifChoice, setNotif]= React.useState(false);

    //STATE OF GAME
    const [currentState, changeState] = React.useState(false)


    //INTERVAL STATE
    const [interval, changeInterval] = React.useState(null);

    //STATE OF WIDGET BEING DISABLED
    const [disabledState, changeDisable] = React.useState(false);

    //CURRENT ERROR MESSAGE
    const [errorMessage, changeErrorMessage] = React.useState("");

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);

    const AudioSound = document.getElementsByClassName("audio-element")[0]

    var count = 0;
    var standCount = 0;


    //function that enables webcam
    const enableWebcam = () => {
        setwebCam(true)
    }

    //function that will play the audio for alarm
    function playAudio() {
        AudioSound.play()
    }


    function getData(obj) {


        console.log(standInterval + " sec mark!")

        if (alarmChoice){
            playAudio()
        }
        if (notifChoice){
            console.log("Here")
            NotificationManager.info('Info message');
        }
        // // create a new XMLHttpRequest
        // var xhr = new XMLHttpRequest()
        // xhr.addEventListener("load", () =>{
        //     var result = JSON.parse(xhr.response)
        //     console.log(result)
        //     result = result["payload"][0]["displayName"]

        //     if (result == "sitting"){
        //     console.log("Sitting")
        //     console.log(count)

        //     count = count + 1
        //     } else {
        //         console.log("Standing")
        //         console.log(count)

        //         //User has stood for a period of time after alarm
        //         if (standCount >= 5 && warnStatus){
        //             standCount = 0
        //             count = 0
        //             changeWarn(false)
        //         }

        //         if (warnStatus){
        //             standCount = standCount + 1
        //         }
        //         else{
        //             standCount = 0
        //             count = 0
        //         }
        //     }
        //     // count has exceeded limit
        //     if (count >= 5) {
        //     changeWarn(true)
        //     if (alarmChoice){
        //         playAudio()
        //     }
        //     if (notifChoice){
        //         NotificationManager.warning('Warning message', 'Time to get Up!', 5000);
        //     }
        //     }
        // });
        // xhr.open("POST", "https://automl.googleapis.com/v1beta1/projects/594510151459/locations/us-central1/models/ICN6904213941828714496:predict");
        // xhr.setRequestHeader('Authorization', 'Bearer ' + "ya29.c.Kp0B5QfKfN9j3s5OCIWx1p_-8iaTpMmYnw_0SxIMUA2vaaoLtH8kHCqjFHOUct8zm7FP9wfTguY11s_Z47eSSwo2R_bzASSr2ZR3CVzZms8unHPg9xzfSutKiIMpPJtRoI4rfs26FXuljIor8cSDeAgX9Fv4DFwcSQuNdXb3tU8gM2d7VTYWih-Pnq1X_aPxoLmjcq9aa3dLuGwNQSBkFA");
        // xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.send(JSON.stringify({"payload": {"image": {"imageBytes": obj}}}));   
    }




    const snapshotImage = () => {

        if (webcamRef.current != null) {

            //GETTING CURRENT SNAPSHOT FROM CAMERA
            const imageSrc = webcamRef.current.getScreenshot();

            //CONVERTING TO STRING
            var parseSrc = String(imageSrc)

            //PARSING NECESSARY CONTENTS OF parseSrc
            var newImageScr = parseSrc.substr(parseSrc.indexOf(",") + 1)
        
            getData(newImageScr)
        }
    }

    const handleChange = (e) => {
        setStandInterval(e.target.value);
    }

    const alarmChange = (e) => {
        if (e.target.value === "on")
            setAlarm(true);
        else
            setAlarm(false);
    }

    const notificationChange = (e) => {
        setNotif(!notifChoice)
    }


    const errorCheck = () =>{
        var error_message = "Error occured: "

        //CHECKING IF WEBCAM IS ON
        if (!webcamEnabled){
            error_message += " Enable webcam"
            changeErrorMessage(error_message)
            return true
        }

        //CHECK IF USER INPUT IS CORRECT
        if (standInterval == null){
            error_message += " Please enter an interval"
            changeErrorMessage(error_message)
            return true
        } else if (standInterval > 100){
            error_message += " Interval cannot be greater than 100"
            changeErrorMessage(error_message)
            return true

        } else if (standInterval < 0){
            error_message += " Interval cannot be less than 30"
            changeErrorMessage(error_message)
            return true
        }

        //CHECK IF AT LEAST ONE OF THE BOXES WAS SELECTED
        if(!alarmChoice && !notifChoice){
            error_message += "Please select at least one option (alarm, notification)"
            changeErrorMessage(error_message)
            return true
        }


        error_message = ""
        changeErrorMessage(error_message)
        return false
    }
    
    const capture = () => {
        //ERROR CHECKING USER INPUT
        if (errorCheck())
            return
        //Called when main button is clicked
        if (!currentState){

            //changing the state of game
            changeState(!currentState)

            //Disabling the settings during the game
            changeDisable(true);

            //Creating an interval
            if (interval == null){
                changeInterval(setInterval(snapshotImage, standInterval * 1000)) 
            }
        } 
    };


    const endCapture = () => {
        if (currentState) {

            //changing the state of game
            changeState(!currentState)
    
            //Enabling the settings again
            changeDisable(false);
    
            if (interval != null) {
                clearInterval(interval)
                changeInterval(null)
            }
        }    
    }

    const logout = () =>{
        app.auth().signOut()
    }


    return (
    <>
    <HomeNavbar />
    <div className="container">

        <audio className="audio-element">
            <source src={ding}></source>
        </audio>

        <div className="header">
            <h4> Using innovative A.I. technology </h4>
            <h4> to prevent back-pain and improve physical health while working</h4>
            <p> Remind A.I. reminds user's to stand when sitting for prolonged periods of time</p>
        </div>


        <div className="user-interaction">

            <div className="webCam-section">
                {webcamEnabled ? (
                    <div className="webcamContainer">
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
                    <div className="webcam-buttom-container">
                        <button className="webcamButton" type="button" onClick={enableWebcam}>
                            Enable webcam
                        </button>
                    </div>
                )}
            </div>

            <div className = "settings">
                <p> Customize settings to begin</p>

                <label>Interval for reminder (seconds): </label>
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
    </>
  );
};

export default MainScreen;