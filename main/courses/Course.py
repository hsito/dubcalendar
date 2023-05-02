from flask import Blueprint
from datetime import time
from main.models import Class


class Course:
    """
    A class that represents a course
    """
    crn: int
    subject: str
    course: int
    section: int
    title: str
    days: str
    startTime: time
    finishTime: time
    location: str

    def __init__(self, crn: int, subject: str, crs: int, sec: int, title: str, days: str, start: time,
                 finish: time, location: str):
        self.days = days
        self.crn = crn
        self.subject = subject
        self.course = crs
        self.section = sec
        self.title = title
        self.startTime = start
        self.finishTime = finish
        self.location = location


# a sample list of courses to manage
qComputing = Course(1234, 'CSC', 134, 800, 'Quantum Computing', 'MWF', time(15, 30), time(16, 40), 'Congdon Hall')
dataMining = Course(123, 'CSC', 135, 800, 'Data Mining', 'MWF', time(18, 30), time(20, 40), 'Congdon Hall')
oop = Course(122, 'CSC', 136, 800, 'Object Oriented Programming', 'MWF', time(13, 30), time(14, 40), 'Congdon Hall')

SAMPLE_COURSES = [qComputing, dataMining, oop]

course_blueprint = Blueprint("course_blueprint", __name__)


@course_blueprint.route("/courses")
def get_course():
    courses = Class.query.all()
    for courses in courses:
        print(courses.classNum)
