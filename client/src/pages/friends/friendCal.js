import React, {useState, useEffect, useImperativeHandle, useRef} from "react";
import "./friends.css"
import {Link} from "react-router-dom";
import {renderToString} from "react-dom/server";
import * as Cg from "react-icons/cg";
/* eslint-disable react/prop-types */
const daysOfWeek = ['S', 'M', 'T', 'W', 'R', 'F', 'U'];

/**
 * A calendar component that displays a friend's events.
 * @param props - friend's email.
 * @returns - A element representing the calendar.
 */
function FriendCal(props, ref) {
  const { friend = '' } = props;
  const [events, setEvents] = useState([]);
  // const [selectedEvent, setSelectedEvent] = useState([])
  // const [descbox, setDescbox] = useState([])


  useEffect(() => {
    setEvents([]);
  }, [friend]);

  /**
   * Gets the friend's events from the server and updates the state with the events.
   * @param friendEmail - The email of the friend whose events to get.
   */
    function getFriendEvents(friendEmail) {
      fetch(`/user_classes/${friendEmail}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Unable to get courses for ${friendEmail}`);
          }
          return response.json();
        })
        .then((classes) => {
          const updatedEvents = [];
          classes.forEach((c) => {
            const classNum = c.classNum;
            const subject = c.subject;
            const eventName = c.className;
            const description = c.description;
            const day = c.days;
            const startTime = c.startTime;
            const endTime = c.endTime;
            updatedEvents.push({ eventName, description, day, startTime, endTime, classNum, subject });
          });
          setEvents(updatedEvents);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    /**
    * Clears a friends classes from the calendar
    * @param friendId - friend identifier
    */
    function clearEvents() {
      setEvents([]);
    }

    useEffect(() => {
      clearEvents();
      getFriendEvents(friend);
    }, [friend]);


  /**
   * Renders the events for a given day of the week.
   * @param dayOfWeek - The day of the week as a letter.
   * @returns - An array of elements representing the events for the given day.
   */
  const renderEvents = (dayOfWeek) => {
        return events.map((event) => {
            if (event.day.includes(dayOfWeek)) {
                const startTime = event.startTime;
                let startHour, startMinute;

                if (startTime >= 1000) { // 4 digit input
                    startHour = Math.floor(startTime / 100);
                    startMinute = startTime % 100;
                } else { // 3 digit input
                    startHour = Math.floor(startTime / 100);
                    startMinute = startTime % 100;
                }

                const endTime = event.endTime;
                let endHour, endMinute;

                if (endTime >= 1000) {
                    endHour = Math.floor(endTime / 100);
                    endMinute = endTime % 100;
                } else {
                    endHour = Math.floor(endTime / 100);
                    endMinute = endTime % 100;
                }

                const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

                if (startHour >= 7 && endHour <= 21 && startHour < endHour) {
                    return (
                        <li
                            className={event.eventName}
                            key={`${friend}-${event.eventName}-${event.startTime}`}
                            style={{
                              "--start": startHour + startMinute / 60,
                              "--duration": duration / 60
                            }}
                            // onClick={(e) => handleEventClick({selectedEvent})}
                            >
                            {/*{event.eventName}*/}
                            {event.subject} {event.classNum}
                        </li>
                    );
                }
            }
        });
    };

  return (
    <div className="calendarWrapperF">
        <div className="calWrapperF">
            <div className="time-slotF">
                <div className="day-headerF"></div>
                <ul>
                    <li>7am</li>
                    <li>8am</li>
                    <li>9am</li>
                    <li>10am</li>
                    <li>11am</li>
                    <li>12pm</li>
                    <li>1pm</li>
                    <li>2pm</li>
                    <li>3pm</li>
                    <li>4pm</li>
                    <li>5pm</li>
                    <li>6pm</li>
                    <li>7pm</li>
                    <li>8pm</li>
                    <li className="last-timeF">9pm</li>
                </ul>
            </div>
            <div className="weekdayF mon">
                <div className="day-headerF">
                    <p>Monday</p>
                </div>
                {/*<div className="event-container" onClick={() => this.handleEventClick(null)}>*/}
                {/*    {this.renderEvents(daysOfWeek[1])}*/}
                {/*</div>*/}
                <div className="event-containerF">
                    {renderEvents(daysOfWeek[1])}
                </div>
                <ul className="timesF">
                    <li className="seven-am"></li>
                    <li className="eight-am"></li>
                    <li className="nine-am"></li>
                    <li className="ten-am"></li>
                    <li className="eleven-am"></li>
                    <li className="twelve-pm"></li>
                    <li className="one-pm"></li>
                    <li className="two-pm"></li>
                    <li className="three-pm"></li>
                    <li className="four-pm"></li>
                    <li className="five-pm"></li>
                    <li className="six-pm"></li>
                    <li className="seven-pm"></li>
                    <li className="eight-pm"></li>
                    <li className="nine-pm"></li>
                </ul>
            </div>
            <div className="weekdayF tue">
                <div className="day-headerF">
                    <p>Tuesday</p>
                </div>
                <div className="event-containerF" >
                    {renderEvents(daysOfWeek[2])}
                </div>
                <ul className="timesF">
                    <li className="seven-am"></li>
                    <li className="eight-am"></li>
                    <li className="nine-am"></li>
                    <li className="ten-am"></li>
                    <li className="eleven-am"></li>
                    <li className="twelve-pm"></li>
                    <li className="one-pm"></li>
                    <li className="two-pm"></li>
                    <li className="three-pm"></li>
                    <li className="four-pm"></li>
                    <li className="five-pm"></li>
                    <li className="six-pm"></li>
                    <li className="seven-pm"></li>
                    <li className="eight-pm"></li>
                    <li className="nine-pm"></li>
                </ul>
            </div>
            <div className="weekdayF wed">
                <div className="day-headerF">
                    <p>Wednesday</p>
                </div>
                <div className="event-containerF">
                    {renderEvents(daysOfWeek[3])}
                </div>
                <ul className="timesF">
                    <li className="seven-am"></li>
                    <li className="eight-am"></li>
                    <li className="nine-am"></li>
                    <li className="ten-am"></li>
                    <li className="eleven-am"></li>
                    <li className="twelve-pm"></li>
                    <li className="one-pm"></li>
                    <li className="two-pm"></li>
                    <li className="three-pm"></li>
                    <li className="four-pm"></li>
                    <li className="five-pm"></li>
                    <li className="six-pm"></li>
                    <li className="seven-pm"></li>
                    <li className="eight-pm"></li>
                    <li className="nine-pm"></li>
                </ul>
            </div>
            <div className="weekdayF thu">
                <div className="day-headerF">
                    <p>Thursday</p>
                </div>
                <div className="event-containerF">
                    {renderEvents(daysOfWeek[4])}
                </div>
                <ul className="timesF">
                    <li className="seven-am"></li>
                    <li className="eight-am"></li>
                    <li className="nine-am"></li>
                    <li className="ten-am"></li>
                    <li className="eleven-am"></li>
                    <li className="twelve-pm"></li>
                    <li className="one-pm"></li>
                    <li className="two-pm"></li>
                    <li className="three-pm"></li>
                    <li className="four-pm"></li>
                    <li className="five-pm"></li>
                    <li className="six-pm"></li>
                    <li className="seven-pm"></li>
                    <li className="eight-pm"></li>
                    <li className="nine-pm"></li>
                </ul>
            </div>
            <div className="weekdayF fri">
                <div className="day-headerF">
                    <p>Friday</p>
                </div>
                <div className="event-containerF">
                    {renderEvents(daysOfWeek[5])}
                </div>
                <ul className="timesF">
                    <li className="seven-am"></li>
                    <li className="eight-am"></li>
                    <li className="nine-am"></li>
                    <li className="ten-am"></li>
                    <li className="eleven-am"></li>
                    <li className="twelve-pm"></li>
                    <li className="one-pm"></li>
                    <li className="two-pm"></li>
                    <li className="three-pm"></li>
                    <li className="four-pm"></li>
                    <li className="five-pm"></li>
                    <li className="six-pm"></li>
                    <li className="seven-pm"></li>
                    <li className="eight-pm"></li>
                    <li className="nine-pm"></li>
                </ul>
            </div>
        </div>
    </div>
  );
}

export default FriendCal;