/**
 * Account Component that displays user information and allows logout functionality.
 * @returns {JSX.Element} Account Component
 */
import "./Account.css";
import React, {useEffect, useState} from "react";
import {Link } from "react-router-dom";
import httpClient from "../../httpClient";
const Account = () =>{

    const [user, setUser] = useState(null);
    const [profilePicURL, setProfilePicURL] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [error, setError] =useState("");

    const handleFileSelect = (event) => {
     setSelectedFile(event.target.files[0]);
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await httpClient.post('/upload_profile_pic', formData);
        setUploadResponse(response.data);
      } catch (err){
          setError(err.response.data.error);
      }
      window.location.href = "/account";
    };
     /**
     * Fetches user data from backend and sets it to state.
     * @function useEffect
     * @param {function} setUser - Function to set user state
     */
    useEffect(() => {
    (async () => {
        try {
            const resp = await httpClient.get("/current_user");
            setUser(resp.data);
            console.log(resp.data.profile_pic)
            if (resp.data.profile_pic) {
                const profilePic = await httpClient.get(
                    `/upload_profile_pic/${resp.data.profile_pic}`,
                    {
                        responseType: "blob",
                    }
                );
                const profilePicObjectURL = URL.createObjectURL(profilePic.data);
                setProfilePicURL(profilePicObjectURL);
            }

        } catch (error) {
            console.log("Error");
        }
    })();
    }, [setUser]);

    /**
     * Logs out user and redirects to home page.
     * @function logoutUser
     * @returns {Promise<void>}
     */
    const logoutUser = async () => {
        await httpClient.post("/logout");
        window.location.href = "/";
    };






    return(
        <div className="account-wrapper">
            <div className="sub-account">
                {user ? (
                    <>
                        {profilePicURL && (
                          <Link to={"/UploadProfilePic"}>
                              <div className='image-container'>
                                <img className='profilePic' src={profilePicURL} alt="Profile picture" />
                                <div className="overlay">
                                  <span>+</span>
                                </div>
                              </div>
                          </Link>
                        )}

                        <h3>{user.fName} {user.lName}</h3>
                        <h5>{user.email}</h5>
                        <Link to="/ChangePassword">
                            <button className="accountBtn">Reset Password</button><br/>
                        </Link>
                        <Link to="/DeleteAccount">
                            <button className="accountBtn" >Delete account</button><br/>
                        </Link>
                        <button onClick={logoutUser} className="accountBtnL" >Logout</button><br/>
                    </>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    )


}
export default Account