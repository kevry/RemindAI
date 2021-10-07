import React from 'react';
import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./MainScreen.css"
import Nav from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Modal from 'react-modal';
import Plot from 'react-plotly.js';
import addNotification from 'react-push-notification';

Modal.setAppElement('#root');
const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  const layout = {
    title: {
      text:'Sit/Stand Tracker',
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'Time (minutes)',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Sit or Stand',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

const MainScreen = ({}) => {

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
    const [errorMessages, pushErrorMessage] = React.useState([]);

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
        setStandInterval(e.target.value * 60);
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
        var error_message = ["Please fix the following:"]
        var errorPresent = false

        //CHECKING IF WEBCAM IS ON
        if (!webcamEnabled){
            error_message.push("Enable webcam")
            pushErrorMessage(error_message)
            errorPresent = true
        }

        //CHECK IF USER INPUT IS CORRECT
        if (standInterval == null){
            error_message.push("Please enter an interval")
            pushErrorMessage(error_message)
            errorPresent = true
        } else if (standInterval > 1800){
            error_message.push("Interval cannot be greater than 30.0 minutes")
            pushErrorMessage(error_message)
            errorPresent = true
        } else if (standInterval < 0){
            error_message.push("Interval cannot be less than 00.0 minutes")
            pushErrorMessage(error_message)
            errorPresent = true
        }

        //CHECK IF AT LEAST ONE OF THE BOXES WAS SELECTED
        if(!alarmChoice && !notifChoice){
            error_message.push("Please select at least one option (alarm, notification)")
            pushErrorMessage(error_message)
            errorPresent = true
        }


        console.log(errorMessages)


        if (errorPresent === false) {
            error_message = []
            pushErrorMessage(error_message)
            return errorPresent
        } else {
            return errorPresent
        }

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
                timearr.push((i * 5)/60);
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

        <audio className="audio-element">
            <source src={ding}></source>
        </audio>

        <div className="header">
            <h4> Prevent back-pain and improve </h4>
            <h4> physical health with Remind A.I.</h4>
            <p> Remind A.I. reminds user's to stand when sitting for prolonged periods of time</p>
            <br></br>
            <h5>Time: {' ' + timer.h + 'h' + ' :' + timer.m + 'm' + ' :' + timer.s + 's'}</h5>
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

                    <label>Sitting limit (minutes): </label>
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

                                {errorMessages.map((item, index) => {
                                    <p key={index}> {item} </p>
                                })}
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


            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >

            <h2> Results: </h2>
            
            <div>
                <h5>
                Time spent: {' ' + finaltimer.h + 'h' + ' :' + finaltimer.m + 'm' + ' :' + finaltimer.s + 's'}
                </h5>

                <div>
                <Plot
                    data={[
                    {
                        x: timeArray,
                        y: dataArray,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                    }]}
                    layout={ layout }
                />
                </div>


                <button onClick={closeModal}> Close </button>
                
                
            </div>

            </Modal>



        </div>

        <div className="footer-location">
            <Footer/>
        </div>
    
    </div>

    </>
  );
};

export default MainScreen;