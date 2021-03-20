import React, { useCallback, useContext, Row } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../base";
import { AuthContext } from "../../Auth.js";
import "./Login.css";

import Nav from '../Navbar/Navbar'


const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/home");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const SignUp = () =>{
    history.push("/signup");
  }

  const MainPage = () =>{
    history.push("/");
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <>

    <Nav/>

      <div className="content">

      <form onSubmit={handleLogin}>
        <div className="signin-form">

          <h4> Sign In </h4>
          <p> Login to your Remind A.I. account</p>


          <div className="comp"> 
            <input name="email" type="email" placeholder="Email or Phone Number" />
          </div>

          <div className="comp">
            <input name="password" type="password" placeholder="Password" />
          </div>

      
          <div className="comp">
            <button className="login-button" type="submit">LOG IN</button>
          </div>

          <a href="/" > Forgot Password?</a>

        </div>
      </form>

      </div>

      </>
  );
};

export default withRouter(Login);