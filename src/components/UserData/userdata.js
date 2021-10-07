import React from 'react';
import Webcam from "react-webcam";
import ding from "../../ding.mp3"
import "./userdata.css"
import Nav from '../HomeNavbar/HomeNavbar'
import Footer from '../Footer/Footer'
import Modal from 'react-modal';
import {app, db} from "../../base";
import { AuthContext } from "../../Auth.js";

import Plot from 'react-plotly.js';

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

const UserData = ({}) => {

    //User email
    const [email, setEmail] =  React.useState();

    const [dataArray, changeArray] = React.useState([])
    //////////////////////////////


    React.useEffect(() => {
        let user = app.auth().currentUser
        if (user != null)
            setEmail(String(user.email))
            console.log(user.email)
    }, [])

    React.useEffect(() =>{
            const fetchData = async () => {
            console.log("Here")
            const snapshot = await db.collection('users').doc(email).collection('userData').get();
            var tempArray = []
            if (snapshot != null) {
                snapshot.docs.forEach((doc) => {
                    tempArray = [...tempArray, doc.data()]
                });
            }
            changeArray(tempArray)
        }
    
            fetchData();
        }, [email]
    )

    function clickB() {
        console.log(dataArray)
    }


   
    return (
    <>
        
    <div className="container">
        <Nav />

        <audio className="audio-element">
            <source src={ding}></source>
        </audio>

        <div className="header">
            <h4> View your results </h4>
        </div>

        <div className="main-body">

            <ul>
                {dataArray.map((item, index) => {
                    return(
                        <li key={index}>
                            <div className="dataPoints">
                                <h4>
                                    Time spent: {' ' + item.timeSpent.h + 'h' + ' :' + item.timeSpent.m + 'm' + ' :' + item.timeSpent.s + 's'}
                                </h4>
                                <div>
                                <Plot
                                    data={[
                                    {
                                        x: item.time,
                                        y: item.sitStandArray,
                                        type: 'scatter',
                                        mode: 'lines+markers',
                                        marker: {color: 'red'},
                                    }]}
                                    layout={layout}
                                />
                                </div>
                            </div>
                        </li>
                    )
                })
                }
                
            </ul>

            

                



        </div>

        <div className="footer-location">
            <Footer/>
        </div>
    
    </div>

    </>
  );
};

export default UserData;