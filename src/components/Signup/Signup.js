import React, { useCallback } from "react";
import { withRouter } from "react-router";
import {app} from "../../base"
import "./Signup.css"

import Navbar from "../Navbar/Navbar"

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { email, password, rpassword} = event.target.elements;

    if (password.value !== rpassword.value){
      alert("Passwords must match")
      return
    }

    try {
      await app
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      history.push("/home");
    } catch (error) {
      alert(error);
    }
  }, [history]);


  return (
    <>


      <Navbar />
      
      <div className="allContent">

      <form onSubmit={handleSignUp}>

        <div className = "register-content">

          <h4>Registration Form</h4>
          <p>Welcome! Create an account to continue</p>

          <div className="register-input">
            
            <div className="comp">
              <input name="email" type="email" placeholder="Email or Phone Number" />
            </div>

            <div className="comp">
              <input name="password" type="password" placeholder="Password" />
            </div>

            <div className="comp">
                <input name="rpassword" type="password" placeholder="Repeat Password" />
            </div>
          </div>
          <button className = "register-button" type="submit">Sign Up</button>

        </div>
      </form>
      </div>


    </>
  );
};

export default withRouter(SignUp);