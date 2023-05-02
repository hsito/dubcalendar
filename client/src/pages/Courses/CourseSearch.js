import "./CourseSearch.css";
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import * as Cg from 'react-icons/cg';

function CourseSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addedCourses, setAddedCourses] = useState([]);



    /**
     * This useEffect hook will run when the component is mounted
     * It will fetch the classes from the server and set it to the classes state
     */
useEffect(() => {
  fetch("/classes")
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      console.log(data);
    })
    .catch((error) => console.log(error)); // Add this line to catch errors
}, []);

    /**
     * This usEffect hook will run when the addedCourses state changes
     */
    useEffect(() => {
  fetch("/current_user")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get current user");
      }
      return response.json();
    })
    .then((data) => {
      const userEmail = data.email;

      fetch(`/user_classes/${userEmail}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch added courses");
          }
          return response.json();
        })
        .then((addedCoursesData) => {
          setAddedCourses(addedCoursesData);
        })
        .catch((error) => console.log(error));
      console.log("Fetched user classes");
      console.log(addedCourses);
    })
    .catch((error) => console.log(error));
}, []);

/**
 * Handle a click on a course, setting the selected course state.
 * @param {Object} course - The course object that was clicked.
 */
  function handleCourseClick(course) {
    setSelectedCourse(course);
  }

  /**
 * Check if a course has already been added.
 * @param {Object} course - The course object to check.
 * @returns {boolean} - Returns true if the course has been added, false otherwise.
 */
    function isCourseAdded(course) {
    return addedCourses.some(
      (addedCourse) =>
          addedCourse.classNum === course.classNum &&
      addedCourse.section === course.section &&
      addedCourse.subject === course.subject
    );
  }

 function renderCourseDetails() {
  if (!selectedCourse) {
    return null;
  }

  function convertTime(time) {
        let hour = Math.floor(time / 100);
        let minute = time % 100;
        let period = (hour >= 12) ? 'pm' : 'am';
        if (hour > 12) {
          hour -= 12;
        } else if (hour === 0) {
          hour = 12;
        }
        return hour + ':' + minute.toString().padStart(2, '0') + period;
    }

 function handleAddCourse() {

  fetch("/current_user")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get current user");
      }
      return response.json();
    })
    .then((data) => {
      const userEmail = data.email;
      const userId = data.id;

      fetch("/user_class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          classNum: selectedCourse.classNum,
          subject: selectedCourse.subject,
          userid: userId,
          section: selectedCourse.section,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add course");
          }
          alert("Course added successfully");
          setAddedCourses([...addedCourses, selectedCourse]);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

  function handleRemoveCourse() {
  fetch("/current_user")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get current user");
      }
      return response.json();
    })
    .then((data) => {
      const userEmail = data.email;
      const userId = data.id;

      fetch("/user_class", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          classNum: selectedCourse.classNum,
          subject: selectedCourse.subject,
          userid: userId,
          section: selectedCourse.section,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to remove course");
          }
          alert("Course removed successfully");
        setAddedCourses(
        addedCourses.filter(
            (course) =>      selectedCourse.classNum !== course.classNum &&
      selectedCourse.section !== course.section &&
      selectedCourse.subject !== course.subject
        )
    );
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

    return (

      <div className="courseContainer">
          <div className="subCourse">
            {/*<div className="btn-Container">*/}
            {/*    <div className="closeBtn" onClick={() => setSelectedCourse(null)}>{<Cg.CgClose/>}</div>*/}
            {/*</div>*/}
            <h2 data-testid = 'className'>{selectedCourse.subject} {selectedCourse.classNum}: {selectedCourse.className}</h2>
            <p>Section: {selectedCourse.section}</p>
            <p>Days: {selectedCourse.days}</p>
            {/*<p>Subject: {selectedCourse.subject}</p>*/}
            <p>{convertTime(selectedCourse.startTime)} - {convertTime(selectedCourse.endTime)}</p>
            {/*<div onClick={() => setSelectedCourse(null)}>{<Cg.CgClose/>}</div>*/}
            <button  className="addDelete" onClick={() => (isCourseAdded(selectedCourse) ? handleRemoveCourse() : handleAddCourse())}>
                {isCourseAdded(selectedCourse) ? "Remove Course" : "Add Course"}
            </button>
          </div>
      </div>
    );
  }

  return (
    <div className="course-wrapper">
      <div className="CourseSearch">
        <div className="searchContainer">
          <div className="searchInputs">
            <input
              type="text"
              placeholder="Search..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
          <div className="dataResult">
            {data
              .filter((val) => {
                if (searchTerm === "") {
                  return val; }
        else {
      const classRepresentation = `${val.className}: ${val.subject} ${val.classNum} ${val.section}`.toLowerCase();
      return classRepresentation.includes(searchTerm.toLowerCase());
    }
              })
                //this is where the search bar is displaying the filtered courses
              .map((val, key) => {
                return (
                  <div
                    data-testid="course"
                    key={key}
                    onClick={() => handleCourseClick(val)}
                  >
                    <p>{val.className}: {val.subject} {val.classNum} {val.section}</p>
                  </div>
                );
              })}
            </div>
        </div>
      {renderCourseDetails()}
      </div>
    </div>
  );
}

export default CourseSearch;

