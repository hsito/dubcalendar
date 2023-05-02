import React, { useState } from 'react';
import "./Sign-up.css"
import httpClient from "../../httpClient";
import logo3 from '../../public/logo3.png'
/**
 * Sign_Up component for user registration.
 *
 * @returns {JSX.Element} Returns the JSX element with registration form.
 */
const Sign_Up = ()=> {
  /**
   * State to store user's email.
   */
  const [email, setEmail] = useState("");

  /**
   * State to store user's password.
   */
  const [password, setPassword] = useState("");

  /**
   * State to store user's first name.
   */
  const [fName, setFName] = useState("");

  /**
   * State to store user's last name.
   */
  const [lName, setLName] = useState("");

  const [error, setError] =useState("");

  /**
   * Function to handle user registration.
   * Sends the user's details to the server for registration.
   * If the registration is successful, redirects the user to home page.
   *
   * @returns {void}
   */
  const registerUser = async () => {
    try {
      const resp = await httpClient.post("/sign-up", {
        email,
        password,
        fName,
        lName
      });

      console.log(resp.data)

      window.location.href = "/calendar";
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="initialWrapper">
      <div className="initialForm">
        <img className="logo" src={logo3}/>
        <div className="initialText">
          <h2>Sign up</h2>
          {error && <div className="error">{error}</div>}
          <form>
            <div>
              <p className="initialP">Email</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id=""
              />
            </div>
            <div>
              <p className="initialP">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id=""
              />
            </div>
            <div>
              <p className="initialP">First Name</p>
              <input
                type="text"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                id=""
              />
            </div>
            <div>
              <p className="initialP">Last Name</p>
              <input
                type="text"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
                id=""
              />
            </div>
            <button className="initialButton" type="button" onClick={() => registerUser()}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sign_Up;