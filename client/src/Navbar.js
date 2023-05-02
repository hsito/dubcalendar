import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import httpClient from "./httpClient";
import logo3 from "./public/logo3.png";
import Button from "react-bootstrap/Button";

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get("/current_user");
                setUser(resp.data);
            } catch (error) {
                console.log("Not authenticated");
            }
        })();
    }, [setUser]);

  return (
      <div>
          {user != null ? (
          <div>
          {/*<h1>Home page</h1>*/}
          {/*    <p>Navigation</p>*/}
          {/*    <Link to="calendar">Calendar</Link><br/>*/}
          {/*    <Link to="account">Account</Link><br/>*/}
          {/*    <Link to="ratings">Ratings</Link><br/>*/}
          {/*    <Link to="courses">Courses</Link><br/>*/}
          {/*    <Link to="Notifications">Notifications</Link><br/>*/}
          {/*    <Link to="Friends">Friends</Link>*/}
          </div>):(
          <div className="initialWrapper">
              <div className="initialForm">
                <img className="logoLarge" src={logo3}/><br/>
                <div className="slContainer">
                    <Link to="/login">
                        <button className="slButton">
                          Login
                        </button>
                    </Link>
                    <Link to="/sign-up">
                        <button className="slButton">
                          Sign-up
                        </button>
                    </Link>
                </div>
              </div>
          </div>
          )}
      </div>
  );
};

export default Navbar;