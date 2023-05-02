import './Ratings.css'
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import StarRating from "./starRating";


function App() {
  const [review, setReview] = useState("");
  const [difficultyRanking, setDifficultyRanking] = useState(1);
  const [professorRanking, setProfessorRanking] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [profs, setProfs] = useState([]);
  const [selectedProf, setSelectedProf] = useState([]);
  const [selectedProfRating, setSelectedProfRating] = useState([]);
  const [course, setCourse] = useState([]);
  const [selectedProfCourse, setSelectedProfCourse] = useState([]);
  const [avgRatings, setAvgRatings] = useState([]);

  useEffect(() => {
    fetch("/professor")
      .then((response) => response.json())
      .then((prof) => setProfs(prof));
  }, []);

  useEffect(() => {
    fetch("/professor_rating")
      .then((response) => response.json())
      .then((rating) => setAvgRatings(rating));
  }, []);

  function handleCourseClick(course){
      setCourse(course);
      // setSelectedProfCourse(course)
  }
  function handleProfClick(prof) {
  setRatings([]);
  setCourse([]);
  setSelectedProf(prof);

  const profRating = avgRatings.find((rating) => rating.profId === prof.profId);
  setSelectedProfRating(profRating || null);

  fetch(`/professor_courses/${prof.profId}`)
      .then((response) => response.json())
      .then((courses) => setSelectedProfCourse(courses));

  if (profRating) {
    fetch(`/ratings/${prof.profId}`)
        .then((response) => response.json())
        .then((data) => setRatings(data));
  }
}

  const handleSubmit = (event) => {
  event.preventDefault();

  const ratingData = {
    classNum: course.classNum,
    subject: course.subject,
    profId: selectedProf.profId,
    review: review,
    difficultyRanking: difficultyRanking,
    professorRanking: professorRanking,
  };

  fetch(`/ratings/${selectedProf.profId}/${course.subject}/${course.classNum}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ratingData),
  })
    .then((response) => response.json())
    .then((data) => {
      setRatings([...ratings, data]);
      setReview("");
      setDifficultyRanking(1);
      setProfessorRanking(1);
    })
    .catch((error) => console.error(error));
};


  useEffect(() => {
  if (selectedProf && course) {
    fetch(`/ratings/${selectedProf.profId}/${course.subject}/${course.classNum}`)
      .then((response) => response.json())
      .then((data) => setRatings(data));
  }
}, [selectedProf, course]);

  return (
    <div className="wrapper">
      <div className="leftContainer">
          <div className="twoSection">
              <div className="searchContainerR">
                  <div className="subSearch">
                      <div className="searchBar" style={{overflow: "hidden"}}>
                          <div className="searchInputs">
                              <input
                                  type="text"
                                  placeholder="Search..."
                                  onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                  }}
                                />
                          </div>
                          <div style={{ height: "auto", maxHeight: "200px", overflow: "auto" }}>
                              <div className="dataResultR" >
                                {profs
                                  .filter((val) => {
                                    if (searchTerm === "") {
                                      return val;
                                    } else if (
                                      val.profLname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      val.profFname.toLowerCase().includes(searchTerm.toLowerCase())
                                    ) {
                                      return val;
                                    }
                                  })
                                  .map((val, key) => {
                                    return (
                                      <div
                                        className="professor"
                                        key={key}
                                        onClick={() => handleProfClick(val)}
                                      >
                                        <p>{val.profFname} {val.profLname}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="ratingsWrapper">
                  <div className="subRatings">
                      {/* Pull selected Professor, rating, and all courses they teach as well as the courses difficult rating */}
                       {selectedProf ? (
                          <div className="selectedProfContainer">
                            <h3>{selectedProf.profFname} {selectedProf.profLname}</h3>
                            {/*<h3>Classes</h3>*/}
                            {selectedProfRating ? (
                              // <p>Overall Rating: {selectedProfRating.avg_rating}</p>
                              <p><StarRating rating={selectedProfRating.avg_rating} /></p>
                            ) : (
                              <p>No ratings yet.</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <h3>Select a Professor</h3>
                          </div>
                        )}

                    {/* Need to create a function to add divs to this section based of num of classes they teach */}
                    <div className="courseBox" style={{ height: "200px", overflowY: "scroll" }}>
                      {selectedProfCourse && selectedProfCourse.map((course) => (
                        <div className="subCourseBox" key={course.classNum} onClick={() => handleCourseClick(course)}>
                          <p>{course.subject} {course.classNum}: {course.className}</p>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
          </div>
          <div className="oneSection">
              <div className="formWrapper">
                  <div className="subForm">
                      <h3>{selectedProf.profFname ?? 'Select a'} {selectedProf.profLname ?? 'Professor'}</h3>
                      <p className="courseNum">{course.subject ?? 'Select a course'} {course.classNum}</p>
                      <form onSubmit={handleSubmit}>
                        <label className="profRatingTitle">
                          Professor Rating:
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={professorRanking}
                            onChange={(event) =>
                              setProfessorRanking(parseInt(event.target.value))
                            }
                          />
                          <span>{professorRanking}</span>
                        </label>
                        <br />
                        <label className="profRatingTitle">
                          Difficulty
                          <input
                            style={{ marginLeft: '15px', marginTop: '5px', backgroundColor: '#ffd57e' }}
                            type="range"
                            min="1"
                            max="5"
                            value={difficultyRanking}
                            onChange={(event) =>
                              setDifficultyRanking(parseInt(event.target.value))
                            }
                          />
                          <span>{difficultyRanking}</span>
                        </label>
                        <br />
                        <p>Comments:</p>
                          <textarea
                            value={review}
                            onChange={(event) => setReview(event.target.value)}
                          />

                        <br />
                        {/*<button type="submit">Submit</button>*/}
                        <button type="submit" class="button-48" role="button"><span class="text">Submit</span></button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      <div className="rightContainer">
          <div className="viewComments">
              <div className="scrollWrapper" >
                  <div className="subScroll">
                      <div className="scrollBox">
                              {/* Pull selected Professor and Course */}
                              {/* Underneath need to query all ratings and create a react function to display them
                               as a new div. */}
                              <ul>
                                {ratings.map((rating, index) => (
                                  <li className="userRating" key={index} >
                                    <div className="topUserRating">
                                        <div className="leftUserRating">
                                            <h3>{selectedProf.profFname} {selectedProf.profLname}</h3>
                                            <h5>{course.subject} {course.classNum}</h5>
                                        </div>
                                        <div className="rightUserRating">
                                            <div className="rankContainer">
                                                <p className="boxTitle">Rating</p>
                                                <div className="rankbox prof" style={{backgroundColor:
                                                    rating.professorRanking >= 4 ? 'forestgreen' :
                                                    rating.professorRanking >= 3 ? 'darkorange' :
                                                    'red'
                                                }}>
                                                    <p className="rating">{rating.professorRanking}</p>
                                                </div>
                                            </div>
                                            <div className="rankContainer">
                                                <p className="boxTitle">Difficulty</p>
                                                <div className="rankbox diff" style={{backgroundColor:
                                                    rating.difficultyRanking >= 4 ? 'red' :
                                                    rating.difficultyRanking >= 3 ? 'darkorange' :
                                                    'forestgreen'
                                                }}>
                                                    <p className="rating">{rating.difficultyRanking}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>{rating.review}</p>
                                  </li>
                                ))}
                                {/*{selectedProfCourse && (*/}
                                {/*  <div>*/}
                                {/*    /!*<h3>Courses Taught:</h3>*!/*/}
                                {/*    /!*<ul>*!/*/}
                                {/*    /!*  {Object.values(selectedProfCourse).map((course) => (*!/*/}
                                {/*    /!*    <li key={course.classNum}>*!/*/}
                                {/*    /!*      <p>{course.subject} {course.classNum}: {course.className}</p>*!/*/}
                                {/*    /!*    </li>*!/*/}
                                {/*    /!*  ))}*!/*/}
                                {/*    /!*</ul>*!/*/}
                                {/*  </div>*/}
                                {/*)}*/}
                              </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;