import React from 'react';
import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./About.css"
import Nav from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Modal from 'react-modal';
import Plot from 'react-plotly.js';
import addNotification from 'react-push-notification';

const About = ({}) => {

    //Section used for Remind A.I. timer
    const [seconds, setSeconds] =  React.useState(0);
    const [timer, setTimer] =  React.useState({'h': '00', 'm': '00', 's': '00'});
    const [isActive, setIsActive] = React.useState(false);

    const [finaltimer, setfinalTimer] =  React.useState({'h': '00', 'm': '00', 's': '00'});
    const [timeArray, settimeArray] = React.useState([])
    const [dataArray, setdataArray] = React.useState([])
    //////////////////////////////

    //sit an stand counters. sitStand array for plot after session ends
    const [sitCount, setsitCount] = React.useState(0)
    const [standCount, setstandCount] = React.useState(0)
    const [sitStandArray, setsitStandArray] = React.useState([])

    //Modal after session ends state
    const [modalIsOpen,setIsOpen] = React.useState(false);

    //WEBCAME STATE
    const [webcamEnabled, setwebCam]= React.useState(false);

    //STAND INTERVAL GIVEN BY INPUT
    const [standInterval, setStandInterval] = React.useState(null);

    //ALARM+NOTIFICATION CHOICES
    const [alarmChoice, setAlarm]= React.useState(false);
    const [notifChoice, setNotif]= React.useState(false);

    //STATE OF GAME
    const [currentState, changeState] = React.useState(false)

    //STATE OF WIDGET BEING DISABLED
    const [disabledState, changeDisable] = React.useState(false);

    //CURRENT ERROR MESSAGE
    const [errorMessage, changeErrorMessage] = React.useState("");

    const webcamRef = React.useRef(null);

    const AudioSound = document.getElementsByClassName("audio-element")[0]

    function toggle() {
        //Toggling the timer
        setIsActive(!isActive);
    }

    function reset() {
        //reset() used to reset timer
        setSeconds(0);
        setIsActive(false);
    }

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }


    React.useEffect(() => {
        let interval = null;
        if (isActive) {
          interval = setInterval(intervalTimer, 1000);
        } else if (!isActive && seconds !== 0) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    function secondsToTime(secs){
        //Used to convert seconds to hrs, mins, and secs
        let hours = Math.floor(secs / (60 * 60));
        if (hours <= 9)
            hours = '0' + String(hours)
        else 
            hours= String(hours)
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        if (minutes <= 9)
            minutes = '0' + String(minutes)
        else 
            minutes = String(minutes)
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        if (seconds <= 9)
            seconds = '0' + String(seconds)
        else 
            seconds = String(seconds)
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
    }

    //Main function interval.... Called every second
    function intervalTimer() {
        let second = seconds + 1;
        setSeconds(second);
        setTimer(secondsToTime(second))

        // Run prediction model every 5 seconds
        if (second % 5 === 0) { 
           snapshotImage()
        }
    }
    

    //function that enables webcam
    const enableWebcam = () => {
        //Cannot turn off camera during mid-process
        if (currentState)
            return

        //Otherwise, take the inverse boolean
        setwebCam(!webcamEnabled)
    }

    //function that will play the audio for alarm
    function playAudio() {
        AudioSound.play()
    }

    function getData(obj) {
        console.log("5 second mark")

        var xhttp= new XMLHttpRequest()

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4 && xhttp.status === 200) {

                var response = String(xhttp.responseText)
                //Changing counts for sit/stand
                if (response === "Sitting"){
                    setsitCount(sitCount + 1)
                    setstandCount(0)
                    var temp = sitStandArray
                    temp.push(0)
                    setsitStandArray(temp)
                } else if (response === "Standing"){
                    setstandCount(standCount + 1)
                    setsitCount(0)
                    var temp = sitStandArray
                    temp.push(1)
                    setsitStandArray(temp)
                } else {
                    console.log("Undetermined response")
                    setsitCount(0)
                    setstandCount(0)
                    var temp = sitStandArray
                    temp.push(sitStandArray[sitStandArray.length - 1])
                    setsitStandArray(temp)
                }

                // Typical action to be performed when the document is ready:
                console.log('sitCount: ' + String(sitCount))
                console.log('standCount: ' + String(standCount))

                // sitCount is multiple of 5. Ex sitCount = 2 means time is 10 secs
                // If interval is 15 sec, 15/5 is 3.
                // Once sitCount reaches interval or more, sound alarm
                if (sitCount >= (standInterval/5)-1){

                    if (alarmChoice){
                        playAudio()
                    }

                    if (notifChoice){
                        console.log("Notif....")
                        addNotification({
                            title: 'Time to stand up',
                            subtitle: 'Remind A.I.',
                            message: 'Take a break for a few seconds',
                            theme: 'darkblue',
                            native: true
                        });
                    }
                }
            }
        };

        xhttp.open("POST", "http://127.0.0.1:5000/");
        xhttp.setRequestHeader("Content-Type", "application/json");

        //data to be sent to API
        var sendData = JSON.stringify(
            {"payload": 
                {"image": 
                    {"imageBytes": obj}
                }
            })
        xhttp.send(sendData);  
    }

    //Function used to take snapshot
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

    //Setting the sitting limit
    const handleChange = (e) => {
        setStandInterval(e.target.value);
    }

    //Alamr checkbox for user
    const alarmChange = (e) => {
        if (e.target.value === "on")
            setAlarm(true);
        else
            setAlarm(false);
    }

    //Notification checkbox for user 
    const notificationChange = (e) => {
        if (e.target.value === "on")
        setNotif(true);
    else
        setNotif(false);
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
    //User begins a new session
        if (errorCheck()) //error checking inputs from user
            return
        //Called when main button is clicked
        if (!currentState && !isActive){
            //changing the state of game
            changeState(!currentState)

            //Reseting all counts
            setsitStandArray([])
            setstandCount(0)
            setsitCount(0)

            //Disabling the settings during the game
            changeDisable(true);

            console.log("Started.....")
            toggle();
        } 
    };

    const endCapture = () => {
    //User clicks end session
        if (currentState && isActive) {

            let objTimer = timer;
            //changing the state of game
            changeState(!currentState)
            //Enabling the settings again
            changeDisable(false);

            //Stopping main interval function
            toggle();
            //Reseting clock
            reset();

            recordResults(objTimer);
        }    
    }


    function recordResults(objTimer){

        setfinalTimer(objTimer);
        console.log(sitStandArray)
        if (sitStandArray.length > 0){

            console.log("Here")
            var timearr = []
            for(var i = 0; i< sitStandArray.length; i++) {
                timearr.push(i * 5);
            }

            settimeArray(timearr)
            setdataArray(sitStandArray)

            openModal()
        }
    }


    return (
    <>
    <div className="container">
        <Nav />

        <div className="header">
            <h4> Prevent back-pain and improve </h4>
            <h4> physical health with Remind A.I.</h4>
            <p> Remind A.I. uses state-of-the-art deep learning methods to track when users are sitting or standing</p>
            <p> If the user has been sitting for more than 30 minutes, either an alarm or notification will activate to remind the user.</p>
            
            <p> On the main page, users can choose to be notified with either an alarm or notification</p>
            <p> and decide the maximum amount of minutes before reminded. The global maximum is 30 minutes.</p>
            
            <br></br>

            <p>When all settings are set, click START to begin.</p>
            <br></br>


            <h4> Create an account </h4>
            <p> Users can also create an account to track their sit stand periods.</p>
            <p> Remind A.I. will track the length of each session and save a graph of the users sit/standing period.</p>
            <p> To create an account, click Sign Up</p>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </div>










        <div className="footer-location">
            <Footer/>
        </div>
    
    </div>

    </>
  );
};

export default About;