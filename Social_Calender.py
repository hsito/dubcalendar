import string
import os
from datetime import datetime
from flask import Flask, session, jsonify, request, send_from_directory
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from config import Config
from main.models import db, User, Class, userClass, friendRequest, Professor, ratesClass, UpcomingNotification
from main.courses.Ratings import ratings_bp
from main.courses.Course import course_blueprint
from main.courses.Professor import professor_bp
from sqlalchemy.orm import aliased
from sqlalchemy import or_, and_
from sqlalchemy import func
from werkzeug.utils import secure_filename

allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}


app = Flask(__name__)
app.register_blueprint(course_blueprint,url_prefix='')
app.register_blueprint(ratings_bp,url_prefix='')
app.register_blueprint(professor_bp,url_prefix='')
app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Social_Calender.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

server_session = Session(app)
bcrypt = Bcrypt(app)

CORS(app, supports_credentials=True)

UPLOAD_FOLDER = 'upload'
app.config['upload'] = UPLOAD_FOLDER

db.init_app(app)
migrate = Migrate(app,db)
with app.app_context():
   db.create_all()

x = datetime.now()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

# Route for seeing a data
@app.route('/data')
def get_time():
   # Returning an api for showing in  reactjs
   return {
      'Name': "Team 3",
      "Date": x,
      "programming": "React and Flask"
   }

@app.route("/current_user")
def get_current_user():
    """
    Gets the current user's ID, email, first name, and last name.

    Returns:
        dict: Dictionary containing the current user's ID, email, first name, and last name.
    """
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email,
        "fName" : user.fName,
        "lName" :user.lName,
        "profile_pic": user.profile_pic
    })


@app.route("/sign-up", methods=["POST"])
def register_user():
    """
    Registers a new user with the given email, password, first name, and last name.

    Returns:
        dict: Dictionary containing the new user's ID and email.
    """
    email = request.json["email"]
    password = request.json["password"]
    fName = request.json["fName"]
    lName = request.json["lName"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    special_chars = string.punctuation  # defines a string of special characters
    has_special_char = any(char in special_chars for char in password)

    if not has_special_char:
        return jsonify({"error": "Password must contain a special character"}), 402

    elif len(email) != 16 or not email.endswith("@uncw.edu"):
        return jsonify({"error": "Email must be 16 characters long and end with @uncw.edu"}), 403

    elif fName is None or lName is None:
        return jsonify({"error": "First and Last names must be entered."}), 406

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, fName=fName, lName=lName, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@app.route("/login", methods=["POST"])
def login_user():
    """
    Logs in a user with the given email and password.

    Returns:
        dict: Dictionary containing the logged-in user's ID and email.

    Raises:
        Unauthorized: If the given email and password do not match any users in the database.
    """
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User does not exist"}), 406

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Password Incorrect"}), 407

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    """
    Logs out the current user.

    Returns:
        str: "200"
    """
    session.pop("user_id")
    return "200"

@app.route('/upload_profile_pic', methods=['POST','GET'])
def upload_profile_pic():
    user_id = session.get('user_id')

    if user_id is None:
        return jsonify({'error': 'User not logged in'})

    if 'file' not in request.files:
        return jsonify({'error': 'No file sent'})

    file = request.files['file']

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'})

    if file.content_length > 5 * 1024 * 1024:
        return jsonify({'error': 'File too large. Max size is 5MB.'})

    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['upload'], filename))

    user = User.query.filter_by(id=user_id).first()
    user.profile_pic = filename
    db.session.commit()

    app.logger.info(f"Uploaded file: {filename}")

    return jsonify({'success': 'Profile picture uploaded'})

@app.route('/upload_profile_pic/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['upload'], filename)

@app.route("/ChangePassword", methods=["POST"])
def change_password():
    """
    Changes the password for the current user with the given new password.

    Returns:
        dict: Dictionary containing the message "Password updated successfully."

    Raises:
        Unauthorized: If there is no current user logged in.
    """
    new_password = request.json["newPassword"]
    user_id = session.get("user_id")

    special_chars = string.punctuation  # defines a string of special characters
    has_special_char = any(char in special_chars for char in new_password)

    if not has_special_char:
        return jsonify({"error": "Password must contain a special character"}), 402
    elif has_special_char:
        cur_user = User.query.filter_by(id=user_id).first()
        cur_user.password = bcrypt.generate_password_hash(new_password)
        db.session.commit()

    return jsonify({"message": "Password updated successfully."}), 200

@app.route("/DeleteAccount", methods=["POST"])
def delete_account():
    """"""
    cur_usr_id = session.get("user_id")
    cur_usr = User.query.filter_by(id=cur_usr_id).first()

    db.session.delete(cur_usr)
    db.session.commit()
    return "User successfully deleted."


@app.route('/classes')
def get_classes():
    """
    Retrieves all classes from the database.

    Returns:
        list: List of dictionaries containing class details.
    """
    classes = Class.query.all()
    class_list = []
    for c in classes:
        class_dict = {
            'classNum': c.classNum,
            'className': c.className,
            'section': c.section,
            'description': c.description,
            'subject': c.subject,
            'startTime': c.startTime,
            'endTime': c.endTime,
            'days': c.days,
            'profId': c.profId
        }
        class_list.append(class_dict)
    return jsonify(class_list)

@app.route('/user_class', methods=['POST'])
def add_user_class():
    """
    Adds a class for a user.

    Request Body:
    - userid (int): The ID of the user
    - email (str): The email address of the user
    - classNum (str): The course number of the class
    - subject (str): The subject of the class
    - section (str): The section of the class

    Returns:
    A JSON object containing a message indicating whether the class was added successfully or not.
    """
    userId = request.json['userid']
    email = request.json['email']
    classNum = request.json['classNum']
    subject = request.json['subject']
    section = request.json['section']

    user_class = userClass(email=email, classNum=classNum, subject=subject, userId=userId, section=section)
    db.session.add(user_class)
    db.session.commit()
    return {'message': 'Course added successfully'}, 201

@app.route('/user_class', methods=['DELETE'])
def remove_user_class():
    """
    Removes a class for a user.

    Request Body:
    - userid (int): The ID of the user
    - email (str): The email address of the user
    - classNum (str): The course number of the class
    - subject (str): The subject of the class
    - section (str): The section of the class

    Returns:
    A JSON object containing a message indicating whether the class was removed successfully or not.
    """
    userId = request.json['userid']
    email = request.json['email']
    classNum = request.json['classNum']
    subject = request.json['subject']
    section = request.json['section']

    user_class = userClass.query.filter_by(email=email, classNum=classNum, subject=subject, userId=userId, section=section).first()
    if user_class:
        db.session.delete(user_class)
        db.session.commit()
        return {'message': 'Course removed successfully'}, 200
    else:
        return {'message': 'Course not found'}, 404


@app.route('/user_classes/<email>')
def get_user_classes(email):
    """
    Retrieves all classes for a user.

    Parameters:
    - email (str): The email address of the user

    Returns:
    A JSON object containing a list of dictionaries representing each class for the user.
    """
    user_classes = db.session.query(Class.classNum, Class.subject, Class.section, Class.className, Class.description, Class.startTime, Class.endTime, Class.days, Class.profId).join(userClass, (userClass.classNum==Class.classNum) & (userClass.subject==Class.subject) & (userClass.section==Class.section)).filter(userClass.email == email).all()
    class_list = []
    for c in user_classes:
        class_dict = {
            'classNum': c.classNum,
            'className': c.className,
            'section': c.section,
            'description': c.description,
            'subject': c.subject,
            'startTime': c.startTime,
            'endTime': c.endTime,
            'days': c.days,
            'profId': c.profId
        }
        class_list.append(class_dict)
    return jsonify(class_list)

@app.route('/friends/<user_id>', methods=['GET'])
def get_user_friends(user_id):
    """
        Retrieves all friends for a user.

        Returns:
        A JSON object containing a list of dictionaries representing each friend for the user.
    """
    User2 = aliased(User)
    friends = db.session.query(
        friendRequest.friendId.label('friendid'),
        friendRequest.userId.label('userid'),
        User.fName.label('user_Fname'),
        User.lName.label('user_Lname'),
        User.email.label('user_email'),
        User2.fName.label('friend_Fname'),
        User2.lName.label('friend_Lname'),
        User2.email.label('friend_email'),
        User2.profile_pic.label('profile_pic'),
    ).join(User, friendRequest.userId == User.id).join(User2, friendRequest.friendId == User2.id).filter(
        friendRequest.status == 'accepted',
        or_(friendRequest.userId == user_id, friendRequest.friendId == user_id)
    ).all()

    friends_list = []
    for friend in friends:
        friend_dict = {}
        if friend.userid == user_id:
            friend_dict['friend_Fname'] = friend.friend_Fname
            friend_dict['friend_Lname'] = friend.friend_Lname
            friend_dict['friend_email'] = friend.friend_email
            friend_dict['friendid'] = friend.friendid
            friend_dict['profile_pic']= friend.profile_pic
        if friend.friendid == user_id:
            friend_dict['friend_Fname'] = friend.user_Fname
            friend_dict['friend_Lname'] = friend.user_Lname
            friend_dict['friend_email'] = friend.user_email
            # friend_dict['userid'] = friend.userid
            friend_dict['friendid'] = friend.userid
            friend_dict['profile_pic'] = friend.profile_pic
        friends_list.append(friend_dict)

    return jsonify(friends_list)


@app.route('/allUsers/<user_id>', methods=['GET'])
def get_all_users(user_id):
    """
    Retrieves all users.

    Returns:
    A JSON object containing a list of dictionaries representing each user.
    """
    users = User.query.outerjoin(friendRequest, or_(
        and_(User.id == friendRequest.userId, friendRequest.friendId == user_id),
        and_(User.id == friendRequest.friendId, friendRequest.userId == user_id)
    )).filter(or_(
        friendRequest.userId == None,
        friendRequest.friendId == None,
        friendRequest.status != 'accepted'
    )).filter(User.id != user_id).all()

    users_list = []
    for u in users:
        user_dict = {
            'id': u.id,
            'email': u.email,
            'fName': u.fName,
            'lName': u.lName,
            'school': u.school
        }

        friend_request = friendRequest.query.filter_by(userId=user_id, friendId=u.id).first()
        if friend_request:
            user_dict['status'] = friend_request.status

        users_list.append(user_dict)

    return jsonify(users_list)


@app.route('/friend_request', methods=['POST'])
def submit_friend_request():
    """
    Submits a friend request for a user.
    """
    if request.method == 'POST':
        userId = request.json['userId']
        friendId = request.json['friendId']
        status = request.json['status']
        rqTime = datetime.now()

        friendRQ = friendRequest(userId=userId, friendId=friendId, status=status, time=rqTime)
        db.session.add(friendRQ)
        db.session.commit()
        return {'message': 'friendRQ sent successfully'}, 201



# Gets the current user email and returns as a
# string (same as the get_current_user,
# but since that returns as json, so had to make a new function
# to call in the add rating for the current user email).
@app.route("/current_user_ratings")
def current_user_ratings():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return user.email
@app.route('/ratings/<prof_id>/<subject>/<int:classNum>', methods=['POST'])
def add_rating(prof_id, subject, classNum):
    email = current_user_ratings()
    classNum = request.json['classNum']
    subject = request.json['subject']
    profId = request.json['profId']
    review = request.json["review"]
    difficultyRanking = request.json["difficultyRanking"]
    professorRanking = request.json["professorRanking"]
    rating = ratesClass(
        email=email,
        classNum=classNum,
        subject=subject,
        profId=profId,
        review=review,
        difficultyRanking=difficultyRanking,
        professorRanking=professorRanking
    )
    db.session.add(rating)
    db.session.commit()
    return jsonify({
        'email': rating.email,
        'classNum':rating.classNum,
        'subject':rating.subject,
        'profId':rating.profId,
        'review': rating.review,
        'difficultyRanking': rating.difficultyRanking,
        'professorRanking': rating.professorRanking
    })

@app.route('/professor_courses/<prof_id>', methods=['GET'])
def get_professor_courses(prof_id):
    professorCourses = db.session.query(Class.classNum, Class.subject, Class.section, Class.className, Class.description, Class.profId).join(Professor, (Professor.profId==Class.profId)).filter(Class.profId == prof_id).all()
    profCourseList = []
    for p in professorCourses:
        prof_course = {
            'classNum': p.classNum,
            'subject': p.subject,
            'section': p.section,
            'className': p.className,
            'description': p.description,
            'profId': p.profId
        }
        profCourseList.append(prof_course)
    return jsonify(profCourseList)



@app.route('/ratings/<prof_id>/<subject>/<int:classNum>', methods=['GET'])
def get_ratings(prof_id, subject, classNum):
    ratings = db.session.query(ratesClass.email, ratesClass.classNum, ratesClass.subject, ratesClass.profId, ratesClass.review, ratesClass.difficultyRanking, ratesClass.professorRanking) \
                        .join(Class, (ratesClass.classNum == Class.classNum) & (ratesClass.subject == Class.subject)) \
                        .filter(ratesClass.profId == prof_id, ratesClass.subject == subject, ratesClass.classNum == classNum) \
                        .all()
    ratingsList = []
    for rating in ratings:
        prof_ratings = {
            'email': rating.email,
            'classNum': rating.classNum,
            'subject': rating.subject,
            'profId': rating.profId,
            'review': rating.review,
            'difficultyRanking': rating.difficultyRanking,
            'professorRanking': rating.professorRanking
        }
        ratingsList.append(prof_ratings)
    return jsonify(ratingsList)



# @app.route('/professor_rating/<int:prof_id>', methods = ['GET'])
# def get_professor_rating(prof_id):
#     avg_rating = db.session.query(
#         func.avg(ratesClass.professorRanking)
#     ).filter(
#         ratesClass.profId == prof_id
#     ).scalar()
#
#     return jsonify({'profId': prof_id, 'avg_rating': avg_rating})

@app.route('/professor_rating', methods=['GET'])
def get_professor_rating():
    avg_ratings = db.session.query(
        ratesClass.profId,
        func.avg(ratesClass.professorRanking)
    ).group_by(
        ratesClass.profId
    ).all()

    return jsonify([{'profId': prof_id, 'avg_rating': avg_rating}
                    for prof_id, avg_rating in avg_ratings])



@app.route('/professor', methods=['GET'])
def get_professors():
    profs = db.session.query(Professor).all()
    prof_list = []
    for p in profs:
        prof_dict = {
            'profId': p.profId,
            'subject': p.subject,
            'profFname': p.profFname,
            'profLname': p.profLname
        }
        prof_list.append(prof_dict)
    return jsonify(prof_list)

@app.route('/request_reject/<friendid>', methods=['GET'])
def reject_friend_request(friendid):
    userId = session.get("user_id")
    db.session.query(friendRequest).filter_by(userId=friendid, friendId=userId, status='pending').delete()
    db.session.commit()

@app.route('/request_accept/<friendid>', methods=['POST'])
def accept_friend_request(friendid):
    userId = session.get("user_id")
    friend_request = friendRequest.query.filter_by(userId=friendid, friendId=userId, status='pending').first()

    if friend_request is not None:
        friend_request.status = 'accepted'
        db.session.commit()

@app.route('/remove_friend/<friendid>', methods=['GET'])
def remove_friend(friendid):
    userId = session.get("user_id")
    db.session.query(friendRequest).filter_by(userId=friendid, friendId=userId, status='accepted').delete()
    db.session.query(friendRequest).filter_by(userId=userId, friendId=friendid, status='accepted').delete()
    db.session.commit()
    return "Friend removed successfully"

@app.route('/cancel_request/<friendid>', methods=['GET'])
def cancel_request(friendid):
    userId = session.get("user_id")
    db.session.query(friendRequest).filter_by(userId=friendid, friendId=userId, status='pending').delete()
    db.session.query(friendRequest).filter_by(userId=userId, friendId=friendid, status='pending').delete()
    db.session.commit()
    return "Friend request canceled"

@app.route('/request_view/<user_id>', methods=['GET'])
def view_friend_request(user_id):
    User2 = aliased(User)
    active_requests = db.session.query(
        friendRequest.friendId.label('userid'),  # user id if request is incoming
        friendRequest.userId.label('friendid'),
        friendRequest.status,
        friendRequest.time,
        User.email.label('user_email'),
        User.fName.label('user_fName'),
        User.lName.label('user_lName'),
        User.school.label('user_school'),
        User2.email.label('friend_email'),
        User2.fName.label('friend_fName'),
        User2.lName.label('friend_lName'),
        User2.school.label('friend_school')
    ).join(
        User, (User.id == friendRequest.friendId)
    ).join(
        User2, (User2.id == friendRequest.userId)
    ).filter(
        friendRequest.friendId == user_id,
        friendRequest.status == "pending"
    ).all()

    request_list = []
    for a in active_requests:
        request_dict = {
            'userid': a.userid,
            'status': a.status,
            'time': str(a.time),
            'friendid': a.friendid,
            'friend_email': a.friend_email,
            'friend_fName': a.friend_fName,
            'friend_lName': a.friend_lName,
            'user_email': a.user_email,
            'user_fName': a.user_fName,
            'user_lName': a.user_lName
        }
        request_list.append(request_dict)

    return jsonify(request_list)

@app.route('/upcoming_notification', methods=['POST'])
def add_upcoming_notification():
    """
    Creates notification based on upcoming event scheduled

    Request Body:
    - email(str): email of user
    - classNum(int): course number
    - subject(str): subject of class
    - message(str): message associated with class
    - time(str): time of class
    - date(str): date of class meeting

    Returns:
    A JSON object of the created notification
    """
    email = request.json['email']
    classNum = request.json['classNum']
    subject = request.json['subject']
    message = request.json['message']
    time = request.json['time']
    date = request.json['date']

    upcoming_notification = UpcomingNotification(email=email, classNum=classNum, subject=subject, message=message, time=time,
    date=date)
    db.session.add(upcoming_notification)
    db.session.commit()
    return jsonify(upcoming_notification)



# Running app
if __name__ == '__main__':
   app.run(debug=True)