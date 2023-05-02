/**
 * A component for allowing users to change their password.
 *
 * @returns {JSX.Element} The React component for changing the user's password.
 */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Account.css"
import httpClient from "../../httpClient";
import {Link} from "react-router-dom";

const ChangePassword = ()=>{
    const [error, setError] =useState("");
    /**
     * The state that holds the new password.
     */
    const [newPassword, setNewPassword] = useState("");

    /**
     * Function that handles the password change.
     *
     * @returns {void}
     */
    const changePassword = async () => {
        try{
            const resp = await httpClient.post("/ChangePassword", {
                newPassword
            });
            console.log(resp.data)
            toast.success("Password updated successfully!");
            window.location.href = "/account";
        } catch (err){
            setError(err.response.data.error);
        }
    }
    return(
        <div className="account-wrapper">
          <div className="sub-account">
            <div className="changePassContainer">
                <h3 className="accountTitle">Change Password</h3>
                {error && <div className="error">{error}</div>}
                <form className="passwordChange">
                    <div>
                        <p className="accountTopText">New Password</p>
                        <input
                            className= "passChange"
                            type = "text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            id=""
                        />
                        <br/>
                        <button className="accountBtn" type="button" onClick={() => changePassword()}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>
    )
};
export default ChangePassword;