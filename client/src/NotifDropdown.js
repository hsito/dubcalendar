import "./NavMain.css";
import React, {useRef, useState,  useEffect} from 'react';
import { Link } from 'react-router-dom';
import * as Bs from 'react-icons/bs';
import * as Ai from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';


function NotifDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null)
    const [userReqs, setUserReqs] = useState([]);
    const ref = useRef(null);
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const { notifications, clear, markAllAsRead, markAsRead } = useNotificationCenter();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    function getCurrentTime() {
      const today = new Date();
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      const seconds = today.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(getCurrentTime());
      }, 1000);
  
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  
    //Grabs time of class and associated message from database
    // fetch('/upcoming_notification')
    //   .then(response => response.json())
    //   .then(data => {
    //     const eventTime = data.time;
    //     const eventMessage = data.message;
    //     console.log(eventTime, eventMessage);
    //
    //     if (getCurrentTime() === eventTime) {
    //       toast.info(eventMessage, { autoClose: 5000 });
    //     }
    //   });
  
    // fetch('/friend_request')
    //   .then(response => response.json())
    //   .then(data => {
    //       const rqTime = data.time;
    //       const rqStatus = data.status;
    //       console.log(rqTime, rqStatus);
    //
    //       if (currentTime === rqTime) {
    //           toast.info(rqStatus, { autoClose: 5000 });
    //       }
    //   });
   
    
  
  //   const showToast = () => {
  //       toast('Hello World', {
  //           data: {
  //               title: 'Hello World Again',
  //               text: 'We are here again with another article'
  //           }
  //       });
  //   };
  //   const showSuccessToast = () => {
  //       toast.success('Hello World', {
  //           data: {
  //               title: 'Success toast',
  //               text: 'This is a success message'
  //           }
  //       });
  //   };
  //   const showErrorToast = () => {
  //       toast.error('Hello World', {
  //           data: {
  //               title: 'Error toast',
  //               text: 'This is an error message'
  //           }
  //       });
  // };


    useEffect(() => {
      fetch("/current_user")
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          const userEmail = data.email;
          fetch(`/request_view/${data.id}`)
            .then((response) => response.json())
            .then((data) => {
              setUserReqs(data);
            })
            .catch((error) => {
              console.log(error);
            });
          fetch(`/user_classes/${userEmail}`)
            .then(response => response.json())
            .then(data => {
              const eventTime = data.startTime;
              console.log("++++++")
              console.log(data);
              const eventMessage = data.className;
              console.log(data.startTime, data.endTime);
            if (getCurrentTime() === data.startTime) {
              toast.info(eventMessage, { autoClose: 5000 });
            }
          });
        });
    }, []);


    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
    };


    const handleRejectRequest = (friendId) => {
      fetch(`/request_reject/${friendId}`)
        .then(response => {
          if (response.ok) {
            console.log("No return");
          } else {
            console.log("Declined successfully");
            setUserReqs(prevReqs => prevReqs.filter(req => req.friendid !== friendId));
          }
        })
        .catch(error => {
          console.log("Error rejecting friend request");
        });
    }

    const handleAcceptRequest = (friendId) => {
      fetch(`/request_accept/${friendId}`,{
          method: "POST"
      })
        .then(response => {
          if (response.ok) {
            console.log("No return");
          } else {
            console.log("Accepted successfully");
            setUserReqs(prevReqs => prevReqs.filter(req => req.friendid !== friendId));
          }
        })
        .catch(error => {
          console.log("Error accepting friend request");
        });
    }


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


      return (
        <div className="dropdown" ref={ref}>
          <div className="dropdown-btn" onClick={toggleDropdown}>
            <a><Bs.BsFillBellFill /></a>
          </div>
          {isOpen && (
            <div className='dropdown-menu'>
              <div className='notifications-section'>
                <div className="button-container">
                    <div className="notif-button" onClick={clear}>Clear Notifications</div>
                    <div className="notif-button" onClick={() => markAllAsRead()}>Mark all as read</div>
                </div>
                <p>{notifications.length === 0 ? 'All caught up!' : ''}</p>

                <ul>
                  {notifications.map((notification) => (
                    <li
                      onClick={() => markAsRead(notification.id)}
                      key={notification.id}
                      style={
                        notification.read ? (
                          { background: 'green', color: 'silver', padding: '0 20px' }
                        ) : (
                          {
                            border: '1px solid black',
                            background: 'navy',
                            color: '#fff',
                            marginBottom: 20,
                            cursor: 'pointer',
                            padding: '0 20px'
                          }
                        )
                      }
                    >
                      <span>id: {notification.id}</span>
                      <p>title: {notification.data.title}</p>
                      <p>text: {notification.data.text}</p>
                    </li>
                  ))}
                </ul>
                <ToastContainer />
              </div>
                {userReqs.length > 0 && <div className="notifications-spacer"></div>}
              <div className='friend-requests-section'>
                {userReqs.map((request) => (
                  <div className="requestContainer" key={request.friendid}>
                    <p className="reqName">{request.friend_fName} {request.friend_lName}</p>
                    <div className="buttons">
                      <div className="requestButtons yes" onClick={() => handleAcceptRequest(request.friendid)}><p>Confirm</p></div>
                      <div className="requestButtons no" onClick={() => handleRejectRequest(request.friendid)}><p>Delete</p></div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
}

export default NotifDropdown
