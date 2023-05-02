import React, { useState, useEffect } from "react";
import {Routes, Route } from "react-router-dom"
import "./App.css";
import AppCal from "./pages/calendar/AppCal";
import Navbar from "./Navbar";
import Notif from "./pages/Notifications/Notif";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/Sign-up";
import AppFriends from "./pages/friends/AppFriends";
import httpClient from "./httpClient";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRate from "./pages/ratings/AppRate";
import AppCourse from "./pages/Courses/AppCourse";
import AppAccount from "./pages/account/AppAccount";
import AppPassword from "./pages/account/AppPassword";
import AppProfilePic from "./pages/account/AppProfilePic";
import AppDelete from "./pages/account/AppDelete";
// import type {User} from "./types";


function App() {

    const [user, setUser] = useState(null);
    const [data, setdata] = useState({
        name: "",
        age: 0,
        date: "",
        programming: "",
    });

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

    useEffect(() => {
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setdata({
                    name: data.Name,
                    date: data.Date,
                    programming: data.programming,
                });
            })
        );
    }, []);



    return (

        <div>
            {/*<NavMain />*/}
            <ToastContainer />
            {user != null ? (
            <div className="App">
                {/*<h1>Social Calendar</h1>*/}
                {/*<h2>Logged in</h2>*/}
                {/*<h3>Email: {user.email}</h3>*/}
                {/*<p>{data.name}</p>*/}
                {/*<p>{data.date}</p>*/}
                {/*<p>{data.programming}</p>*/}

                <Routes>
                    <Route path="/" element={<Navbar />} />
                    <Route path= "/account" element={<AppAccount />} />
                    <Route path= "/ChangePassword" element={<AppPassword />} />
                    <Route path="/UploadProfilePic" element={<AppProfilePic />} />
                    <Route path= "/DeleteAccount" element={<AppDelete />} />
                    <Route path="/sign-up" element={<SignUp/>}></Route>
                    <Route path="/calendar" element={<AppCal />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/ratings" element={<AppRate />} />
                    <Route path="/courses" element={<AppCourse />} />
                    <Route path= "/Notifications" element={<Notif />} />
                    <Route path="/Friends" element={<AppFriends />} />
                </Routes>

                {/*<button onClick={logoutUser}>Logout</button>*/}
            </div>
            ):(
            <div className="App">

            {/*<h1>Social Calendar</h1>*/}
            {/*<p>{data.name}</p>*/}
            {/*<p>{data.date}</p>*/}
            {/*<p>{data.programming}</p>*/}

            <Routes>
                <Route path= "/ChangePassword" element={<AppPassword />} />
                <Route path="/" element={<Navbar />} />
                <Route path="/sign-up" element={<SignUp/>}></Route>
                <Route path="/calendar" element={<AppCal />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ratings" element={<AppRate />} />
                <Route path="/courses" element={<AppCourse />} />
                <Route path= "/Notifications" element={<Notif />} />
                <Route path= "/account" element={<AppAccount />} />
                <Route path="/Friends" element={<AppFriends />} />
            </Routes>
            </div>
        )}
        </div>
    );
}

export default App;
