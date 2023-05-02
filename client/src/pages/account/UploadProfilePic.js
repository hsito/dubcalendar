import "./Account.css";
import React, { useState } from 'react';
import httpClient from "../../httpClient";
import {Link} from "react-router-dom";

const UploadProfilePic = () => {
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

  return (
    <div className="account-wrapper">
      <div className="sub-account">
        <h3 className="accountTitle">Upload Profile Picture</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileSelect} />
          <button type="submit">Upload</button><br/>
        </form>
        {uploadResponse && <p>{uploadResponse.success}</p>}
      </div>
    </div>
  );
};

export default UploadProfilePic;