
import { toast, ToastContainer } from 'react-toastify';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import { useState, useEffect } from 'react';


/**
 * Pop up notifications for upcoming events scheduled on your calendar.
 * @returns Appropriate pop up message
 */
const Dash = () => {
  const { notifications, clear, markAllAsRead, markAsRead } = useNotificationCenter();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

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
  fetch('/upcoming_notification')
    .then(response => response.json())
    .then(data => {
      const eventTime = data.time;
      const eventMessage = data.message;
      console.log(eventTime, eventMessage);

      if (getCurrentTime() === eventTime) {
        toast.info(eventMessage, { autoClose: 5000 });
      }
    });

  fetch('/friend_request')
    .then(response => response.json())
    .then(data => {
        const rqTime = data.rqTime
        const rqData = data.data
        console.log(rqTime, rqData);

        if (currentTime === rqTime) {
            toast.info(rqData, { autoClose: 5000 });
        }
    });
 
  

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
  return (
      <div>
          <p>{notifications.length}</p>
          {/* <button onClick={showToast}>Default</button>
          <button onClick={showSuccessToast}>Success</button>
          <button onClick={showErrorToast}>Error</button>
          <br />
          <br /> */}
          <button onClick={clear}>Clear Notifications</button>
          <button onClick={() => markAllAsRead()}>Mark all as read</button>
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
  );
};
export default Dash;