import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import "./Account.css"
import httpClient from "../../httpClient";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

const DeleteAccount = () =>{
    const deleteAccount = async () => {
        await httpClient.post("/DeleteAccount", {});
        toast.success("Password updated successfully!");
        window.location.href = "/";
    }
    return(
        <div className="account-wrapper">
          <div className="sub-account">
              <div className="confirmDeleteContainer">
                <h3 className="accountTitle">Are you sure you want to delete?</h3>
                    <div className="confirmDelete">
                        <button className="accountBtn" type="button" onClick={() => deleteAccount()}>
                            Delete
                        </button>
                    </div>
                <Link to="/Account" className="backBtn">cancel</Link><br/>
                  <div className="deleteMargin"></div>
              </div>
          </div>
        </div>
    )
}
export default DeleteAccount