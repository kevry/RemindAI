import React from "react";
import "./App.css";
import { Notifications } from 'react-push-notification';


import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import UserData from "./components/UserData/userdata"
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/Signup";
import About from "./components/About/About";
import MainScreen from "./components/MainScreen/MainScreen";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (

    <>
    <Notifications />
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/home/results" component={UserData} />
          <Route exact path="/" component={MainScreen} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/about" component={About} />
        </div>
      </Router>
    </AuthProvider>
    </>

  );
};

export default App;
