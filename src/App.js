import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar"

import Footer from "./components/Footer/Footer"


import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/Signup";
import MainScreen from "./components/MainScreen/MainScreen";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (

    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/home" component={Home} />
          <Route exact path="/" component={MainScreen} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>

  );
};

export default App;
