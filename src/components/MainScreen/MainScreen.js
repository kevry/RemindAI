import React from 'react';


import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./MainScreen.css"
import Nav from '../Navbar/Navbar'

import Footer from '../Footer/Footer'


const MainScreen = ({history}) => {

    var sitCount = 0;
    var standCount = 0;

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

    const AudioSound = document.getElementsByClassName("audio-element")[0]

    //function that enables webcam
    const enableWebcam = () => {
        setwebCam(!webcamEnabled)
    }

    //function that will play the audio for alarm
    function playAudio() {
        AudioSound.play()
    }


    function getData(obj) {


        console.log(5+ " sec mark!\n")
        var xhttp= new XMLHttpRequest()

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                // Typical action to be performed when the document is ready:
                console.log(String(xhttp.responseText))
                console.log('sitCount: ' + String(sitCount))
                console.log('standCount: ' + String(standCount))

                
                //Chaning counts for sit/stand
                if (String(xhttp.responseText) === "Sitting"){
                    console.log("!!!!!!!!!!!")
                    sitCount += 1
                    standCount = 0

                } else {
                    standCount += 1
                    sitCount = 0
                }

                //sitCount is multiple of 5. Ex sitCount = 2 means time is 10 secs
                // If interval is 15 sec, 15/5 is 3.
                // Once sitCount reaches 3 or more, sound alarm
                if (sitCount >= standInterval/5){
                    playAudio()
                }
            } else {
                console.log("Error")
            }
        };

        xhttp.open("POST", "http://127.0.0.1:5000/");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({"payload": {"image": {"imageBytes": obj}}})); 

        
    }




    const snapshotImage = () => {

        if (webcamRef.current != null) {

            //GETTING CURRENT SNAPSHOT FROM CAMERA
            const imageSrc = webcamRef.current.getScreenshot();

            //CONVERTING TO STRING
            var parseSrc = String(imageSrc)

            // //PARSING NECESSARY CONTENTS OF parseSrc
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

            //Chaning sit/stand every 5 seconds
            if (interval == null){
                changeInterval(setInterval(snapshotImage, 5000)) 
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


    return (
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
};

export default MainScreen;