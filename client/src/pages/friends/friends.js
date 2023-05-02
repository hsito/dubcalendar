import './friends.css'
import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import FriendCal from "./friendCal";
import httpClient from "../../httpClient";
import * as Ai from 'react-icons/ai';

/**
 * Component for displaying the user's friends and allowing them to add new friends
 *
 * State:
 * - friends: An array of the user's friends
 * - showAllFriends: A indicator used for seeing which tab the user selected
 * - searchTerm: A string used to filter the list of users when searching for new friends
 * - users: An array of all users
 * - currentUser: The ID of the current user
 * - selectedFriend: The ID of the selected friend
 * - selectedFriendEvents: A array selected friend's events

 * Handlers:
 * - handleUserClick: Sets the currently selected friend to the friend whose was selected
 * - handleAllFriendsClick: Shows all friends
 * - handleConnectClick: Shows the search bar to search for friends
 * - handleFriendRequest: Sends a friend request
 * - getFriendEvents: Gets a specific user's events
 *
 * @return Friends page with FriendCal
 */


function Friends() {
  const [friends, setFriends] = useState([]);
  const [showAllFriends, setShowAllFriends] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedFriend, setSelectedFriend] = useState([])
  const [friendEmail, setFriendEmail] = useState("")
  const [friendId, setFriendId] = useState([])
  const [button, setButton] = useState("Follow");
  const [userStates, setUserStates] = useState([]);

  // useEffect(() => {
  //   // fetch("/friends")
  //   //   .then((response) => response.json())
  //   //   .then((data) => setFriends(data));
  //   fetch("/allUsers")
  //     .then((response) => response.json())
  //     .then((data) => setUsers(data));
  // }, []);

  // useEffect(() => {
  //     fetch("/current_user")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setCurrentUser(data);
  //         fetch(`/friends/${data.id}`)
  //           .then((response) => response.json())
  //           .then((data) => {
  //             setFriends(data);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });
  //       });
  //   }, []);

  // useEffect(() => {
  //   fetch("/current_user")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCurrentUser(data);
  //       fetch(`/friends/${data.id}`)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setFriends(data);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //       fetch(`/allUsers/${data.id}`)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setUsers(data);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     });
  // }, []);

    useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/current_user")
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data);
          fetch(`/friends/${data.id}`)
            .then((response) => response.json())
            .then((data) => {
              setFriends(data);
            })
            .catch((error) => {
              console.log(error);
            });
          fetch(`/allUsers/${data.id}`)
            .then((response) => response.json())
            .then((data) => {
              setUsers(data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);


  // useEffect(() => {
  //       (async () => {
  //           try {
  //               const resp = await httpClient.get("/current_user");
  //               setCurrentUser(resp.data);
  //           } catch (error) {
  //               console.log("Not authenticated");
  //           }
  //       })();
  //       }, [setCurrentUser]);

  /**
   * Updates the selected user
   * @param friend - The selected friend.
   */
  const handleUserClick = (friend) => {
    console.log("=======");
    console.log(friends);
    setSelectedFriend(friend.friendid);
    setFriendEmail(friend.friend_email);
    // setFriendId(friend.friendid);
  }

  /**
   * Shows all friends when section is clicked
   */
  const handleAllFriendsClick = () => {
    setShowAllFriends(true);
  };

  /**
   * Shows the search for a user to add a friend
   */
  const handleConnectClick = () => {
    setShowAllFriends(false);
    setSearchTerm("");
  };

  /**
   * Adds a friend request to the databse
   * @param friendId - The email of the friend a user wants to add.
   */
  function handleFriendRequest(friendId) {
    fetch('/friend_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        friendId: friendId,
        status: 'pending',
        time: new Date().toISOString()
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Sent successfully');
        setUserStates(prevStates => prevStates.map(state => {
          if (state.id === friendId) {
            return {...state, buttonLabel: "Cancel", onClickFunction: () => handleCancelRequest(friendId)};
          }
          return state;
        }));
      } else {
        console.log('Failed');
      }
    })
    .catch(error => {
      console.error('Error sending friend request:', error);
    });

  }

  /**
  * Removes a friend from their list of friends
  * @param friendId - friend identifier
  */
  const handleRemoveFriend = (friendId) => {
    fetch(`/remove_friend/${friendId}`, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          console.log("Removed successfully");
          setFriends(prevReqs => prevReqs.filter(req => req.friendid !== friendId));
          setFriendEmail("");
          // setFriendId(null);
          setSelectedFriend(null);
        } else {
          console.log("Error removing friend");
        }
      })
      .catch(error => {
        console.log("Error removing friend");
      });
  };

  /**
  * Cancels a friend request
  * @param friendId - friend identifier
  */
  const handleCancelRequest = (friendId) => {
      fetch(`/cancel_request/${friendId}`)
        .then(response => {
          if (response.ok) {
            console.log("canceled successfully");
            setUserStates(prevStates => prevStates.map(state => {
              if (state.id === friendId) {
                return {...state, buttonLabel: "Follow", onClickFunction: () => handleFriendRequest(friendId)};
              }
              return state;
            }));
            setButton("Follow")
          } else {
            console.log("Error cancelling request");

          }
        })
        .catch(error => {
          console.log("Error canceling friend request");
        });
    }



  return (
    <div className="wrapper1">
      <div className="fullContainer">
        <div className="sideContainer">
          <div className="friendsHeader">
            <div className="sideHeaders" onClick={handleAllFriendsClick}>
              <h3>Friends</h3>
            </div>
            <div className="sideHeaders" onClick={handleConnectClick}>
              <h3>Connect</h3>
            </div>
          </div>
          <div className="subSideContainer">
            {showAllFriends ? (
              <div className="allFriendsContainer">
                <div className="scrollWrapper">
                  <div className="subScroll">
                    <div className="scrollBoxF">
                      {friends.length > 0 ? (
                        friends.map((friend) => (
                          <div
                              className={`friend ${friend.friendid === selectedFriend ? 'selected' : ''}`}
                              key={friend.friendid}
                              onClick={() => handleUserClick(friend)}
                          >
                            <div className="subFriend">
                              <p>{friend.friend_Fname} {friend.friend_Lname}</p>
                              <div className='removeFriend' onClick={() => {
                                handleUserClick(friend);
                                handleRemoveFriend(friend.friendid);
                              }}>
                                <Ai.AiOutlineUserDelete  data-testid="delete-icon" /></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No friends</div>
                      )}
                    </div>
                  {/*  <div className="scrollBoxF">*/}
                  {/*    {friends.length > 0 ? (*/}
                  {/*        friends.map(async (friend) => {*/}
                  {/*            let profilePicURL = '';*/}
                  {/*            if (friend.profile_pic) {*/}

                  {/*                const profilePic = await httpClient.get(*/}
                  {/*                    `/upload_profile_pic/${friend.profile_pic}`,*/}
                  {/*                    {*/}
                  {/*                        responseType: "blob",*/}
                  {/*                    }*/}
                  {/*                );*/}
                  {/*                profilePicURL = URL.createObjectURL(profilePic.data);*/}
                  {/*                console.log(profilePicURL)*/}
                  {/*            }*/}
                  {/*            return (*/}
                  {/*                <div*/}
                  {/*                    className={`friend ${friend.friendid === selectedFriend ? 'selected' : ''}`}*/}
                  {/*                    key={friend.friendid}*/}
                  {/*                    onClick={() => handleUserClick(friend)}*/}
                  {/*                >*/}
                  {/*                    <div className="subFriend">*/}
                  {/*                        {profilePicURL && <img className='profilePicF' src={profilePicURL} alt="Profile picture" />}*/}
                  {/*                        <p>{friend.friend_Fname} {friend.friend_Lname}</p>*/}
                  {/*                        <div className='removeFriend' onClick={() => {*/}
                  {/*                            handleUserClick(friend);*/}
                  {/*                            handleRemoveFriend(friend.friendid);*/}
                  {/*                        }}>*/}
                  {/*                            <Ai.AiOutlineUserDelete data-testid="delete-icon" />*/}
                  {/*                        </div>*/}
                  {/*                    </div>*/}
                  {/*                </div>*/}
                  {/*            );*/}
                  {/*        })*/}
                  {/*    ) : (*/}
                  {/*        <div>No friends</div>*/}
                  {/*    )}*/}
                  {/*</div>*/}

                  </div>
                </div>
              </div>
            ) : (
              <div className="searchFriendsContainer">
                <input
                  type="text"
                  placeholder="Find friends"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                {searchTerm && (
                    <div className="userResult">
                      {users
                        .filter((val) => {
                          if (searchTerm === "") {
                            return val;
                          } else if (
                              (val.fName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())) ||
                              (val.lName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()))
                          ) {
                            return val;
                          }
                        })
                        .map((val, key) => {
                          const friendRequest = users.find(
                            (friendReq) => friendReq.id === val.id
                          );
                          let buttonLabel = "Follow";
                          let onClickFunction = () => handleFriendRequest(val.id);
                          if (friendRequest && friendRequest.status === "pending") {
                            buttonLabel = "Cancel";
                            onClickFunction = () => handleCancelRequest(val.id);
                          }
                          return (
                            <div className="aUser"
                              key={key}
                            >
                              <p>{val.fName} {val.lName}</p>
                              <div className="button" onClick={onClickFunction}>{buttonLabel}</div>
                            </div>
                          );
                        })}
                    </div>

                )}
              </div>
            )}
          </div>
        </div>
        <div className="calendarContainer">
          <FriendCal friend={friendEmail} />
        </div>
      </div>
    </div>
  );
}
export default Friends;


ReactDOM.render(<Friends />, document.getElementById("root"));


