import './styles.css'
import React, {Component} from "react"
import {Link} from "react-router-dom";
import { renderToString } from 'react-dom/server';
import * as Cg from 'react-icons/cg';

// const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysOfWeek = ['S', 'M', 'T', 'W', 'R', 'F', 'U'];
/**
 * Class for displaying a user's events
 *
 * State:
 * - events: user's events
 * - selectedEvent: event user clicks on
 * - descBox: Div containing description of selected event
 *
 * Functions:
 * - addEventsToCalendar: adds users events from database
 * - componentDidMount: loads events onto calendar upon runtime
 * - handleEventClick: creates a descBox
 * - handleDeleteEvent: Deletes an event
 * - handleCloseBoxClick: Closes a descBox
 * - renderEvents: Puts event on a specific spot in the Calendar based off of time
 *
 *
 * @return the user's calendar with their events
 */
class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = { events: [], selectedEvent: null, descBox: null };
    }

    /**
     * Displays user's courses on the calendar
    */
    addEventsToCalendar = () => {
        fetch("/current_user")
        .then((response) => {
            if (!response.ok) {
               throw new Error("User identity error");
            }
            return response.json();
        })
        .then((data) => {
            const userEmail = data.email;
            fetch(`/user_classes/${userEmail}`)
            .then((response) => {
                if (!response.ok) {
                  throw new Error(`Unable to get courses for ${userEmail}`);
                }
                return response.json();
            })
            .then((classes) => {
                const updatedEvents = [...this.state.events];
                classes.forEach((c) => {
                    const classNum = c.classNum;
                    const subject = c.subject;
                    const eventName = c.className;
                    const description = c.description;
                    const day = c.days;
                    const startTime = c.startTime;
                    const endTime = c.endTime;
                    const events = this.state.events.slice();
                    updatedEvents.push({ eventName, description, day, startTime, endTime, classNum, subject  });
                    this.setState({ events });

                });
                this.setState({ events: updatedEvents });
            })
            .catch((error) => {
                console.error(error);
            });
        });
    };

    /**
     * Calls addEvents to calendar at runtime
    */
    componentDidMount() {
        this.addEventsToCalendar();
    }

    /**
     * Creates a description box for the selected event
     * @param event - user selected event
     * @param day - day of the week
     */
    handleEventClick = (event, day) => {
        /**
         * Converts time from integer to standard format
         * @param time - day of the week
         */
        const convertTime = (time) => {
            let hour = Math.floor(time / 100);
            let minute = time % 100;
            let period = (hour >= 12) ? 'pm' : 'am';
            if (hour > 12) {
              hour -= 12;
            } else if (hour === 0) {
              hour = 12;
            }
            return hour + ':' + minute.toString().padStart(2, '0') + period;
        };

        const { selectedEvent, descBox } = this.state;
        if (selectedEvent === event) {
            descBox.remove();
            this.setState({ selectedEvent: null, descBox: null });
            return;
        }
        if (descBox)  {
            descBox.remove();
        }

        const startTime = event.startTime;
        let startHour, startMinute;

        if (startTime >= 1000) { // input has 4 digits
          startHour = Math.floor(startTime / 100);
          startMinute = startTime % 100;
        } else { // input has 3 digits
          startHour = Math.floor(startTime / 100);
          startMinute = startTime % 100;
        }

        let newDescBox;
        if (day.includes("F") || day.includes("R")) {
            newDescBox = document.createElement('div');
            newDescBox.className = 'desc-box-right';
        } else {
            newDescBox = document.createElement('div');
            newDescBox.className = 'desc-box';
        }

        if (!newDescBox) {
            throw new Error("newDescBox is not initialized");
        }

        const descName = document.createElement('div');
        descName.innerHTML = event.eventName;
        descName.className = 'eventName';

        const descText = document.createElement('div');
        const start = convertTime(event.startTime);
        const end = convertTime(event.endTime);
        descText.innerHTML = start + ' - ' + end;
        descText.className = 'desc-text';

        const closeButton = document.createElement('div');
        closeButton.innerHTML = renderToString(<Cg.CgClose/>);
        closeButton.className = 'close-button';
        closeButton.onclick = (e) => { this.handleCloseBoxClick(e, newDescBox); };

        newDescBox.appendChild(closeButton);
        newDescBox.appendChild(descName);
        newDescBox.appendChild(descText);


        newDescBox.style.setProperty("--start", `${startHour + startMinute / 60}`);
        event.target.parentNode.appendChild(newDescBox);

        this.setState({ selectedEvent: event, descBox: newDescBox });
    };

    /**
     * Closes a description box for the selected event
     * @param descBox - description box for selected event
     */
    handleCloseBoxClick = (e, descBox) => {
        descBox.remove();
        this.setState({ selectedEvent: null, descBox: null });
    };

    /**
     * Renders all courses that the user has
     * @param dayOfWeek - day of the week
     */
    renderEvents = (dayOfWeek) => {
        return this.state.events.map((event) => {
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
                            key={event.startTime}
                            style={{
                              "--start": startHour + startMinute / 60,
                              "--duration": duration / 60
                            }}
                            onClick={(e) => this.handleEventClick({ ...event, target: e.currentTarget }, dayOfWeek)}
                            >
                            {/*{event.eventName}*/}
                            <div className="eventNameTime">
                              {event.subject} {event.classNum}
                            </div>
                        </li>
                    );
                }
            }
        });
    };


    render() {
        return (
            <div className="wrapper1">
                {/*<div className="event-form">*/}
                {/*    <input type="text" placeholder="Event Name" ref={this.eventNameRef} />*/}
                {/*    <input type="text" placeholder="Description" ref={this.descriptionRef} />*/}
                {/*    <input type="text" placeholder="Days" ref={this.dayRef} />*/}
                {/*    <input type="number" ref={this.startTimeRef} />*/}
                {/*    <input type="number" ref={this.endTimeRef} />*/}
                {/*    <button onClick={this.addNewEvent}>Add</button>*/}
                {/*</div>*/}
                <div className="calWrapper">
                    <div className="time-slot">
                        <div className="day-header"></div>
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
                            <li className="last-time">9pm</li>
                        </ul>
                    </div>
                    <div className="weekday mon">
                        <div className="day-header">
                            <p>Monday</p>
                        </div>
                        <div className="event-container" onClick={() => this.handleEventClick(null, "M")}>
                            {this.renderEvents(daysOfWeek[1])}
                        </div>
                        <ul className="times">
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
                    <div className="weekday tue">
                        <div className="day-header">
                            <p>Tuesday</p>
                        </div>
                        <div className="event-container" onClick={() => this.handleEventClick(null, "T")}>
                            {this.renderEvents(daysOfWeek[2])}
                        </div>
                        <ul className="times">
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
                    <div className="weekday wed">
                        <div className="day-header">
                            <p>Wednesday</p>
                        </div>
                        <div className="event-container" onClick={() => this.handleEventClick(null, "W")}>
                            {this.renderEvents(daysOfWeek[3])}
                        </div>
                        <ul className="times">
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
                    <div className="weekday thu">
                        <div className="day-header">
                            <p>Thursday</p>
                        </div>
                        <div className="event-container" onClick={() => this.handleEventClick(null, "R")}>
                            {this.renderEvents(daysOfWeek[4])}
                        </div>
                        <ul className="times">
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
                    <div className="weekday fri">
                        <div className="day-header">
                            <p>Friday</p>
                        </div>
                        <div className="event-container" onClick={() => this.handleEventClick(null, "F")}>
                            {this.renderEvents(daysOfWeek[5])}
                        </div>
                        <ul className="times">
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
                {/*<Link to="/">Nav Bar</Link>*/}
            </div>
        );
    }
}
export default Calendar;