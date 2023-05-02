/**
 * Component for logging in a user with email and password.
 * Uses httpClient to send a POST request to the login endpoint.
 * @returns {JSX.Element} Login form.
 */
import React, { useState } from "react";
import "./Login.css";
import httpClient from "../../httpClient";
import logo3 from "../../public/logo3.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] =useState("");

  /**
   * Sends a POST request to the login endpoint with email and password.
   * Redirects user to homepage if login is successful.
   * Displays an alert if login is unsuccessful.
   * @returns {void}
   */
  const logInUser = async () => {
    console.log(email, password);

    try {
      const resp = await httpClient.post("/login", {
        email,
        password,
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
          <h2>Login</h2>
          <form>
            <div>
              {error && <div className="error">{error}</div>}
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
            <button className="initialButton" type="button" onClick={() => logInUser()}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

