from datetime import datetime
from datetime import date
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import ForeignKey, ForeignKeyConstraint

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex
class User(db.Model):
    id = db.Column(db.String(32), unique=True, default=get_uuid)
    email = db.Column(db.String(16), primary_key=True)
    fName = db.Column(db.String(25))
    lName = db.Column(db.String(25))
    password = db.Column(db.Text(128))
    school = db.Column(db.String(60))
    profile_pic = db.Column(db.String(255), default='default.png')

    def __repr__(self):
        return '<User id:{} email:{} fName:{} lName:{} password:{} school:{}>'.format(
            self.id, self.email, self.fName, self.lName, self.password, self.school
        )

class Professor(db.Model):
    profId = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(40))
    profFname = db.Column(db.String(25))
    profLname = db.Column(db.String(25))

    def __repr__(self):
        return '<Professor profId:{} subject:{} profFname:{} profLname:{}>'.format(
            self.profId, self.subject, self.profFname, self.profLname
        )

class Class(db.Model):
    classNum = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(5), primary_key=True)
    section = db.Column(db.Integer, primary_key=True)
    className = db.Column(db.String(60))
    description = db.Column(db.String(500))
    startTime = db.Column(db.Integer)
    endTime = db.Column(db.Integer)
    days = db.Column(db.String(120))
    profId = db.Column(db.Integer, db.ForeignKey('professor.profId'))



    def __repr__(self):
        return '<classNum {}>'.format(self.classNum, self.subject, self.startTime, self.endTime,self.days,self.profId)



class UpcomingNotification(db.Model):
    # var count for String foreign keys?
    email = db.Column(db.String, db.ForeignKey('user.email'), primary_key=True)
    classNum = db.Column(db.Integer, db.ForeignKey('class.classNum'))
    subject = db.Column(db.String, db.ForeignKey(Class.subject))
    message = db.Column(db.String(300))
    time = db.Column(db.DateTime, default=datetime.utcnow)
    date = db.Column(db.DateTime, default=date.today())

    def __repr__(self):
        return '<UpcomingNotification {}>'.format

class ratesClass(db.Model):
    # var count for String foreign keys?
    email = db.Column(db.String(25), db.ForeignKey('user.email'), primary_key=True)
    classNum = db.Column(db.Integer, db.ForeignKey('class.classNum'), primary_key=True)
    subject = db.Column(db.String(5), db.ForeignKey('class.subject'), primary_key=True)
    profId = db.Column(db.Integer, db.ForeignKey('class.profId'), primary_key=True)
    review = db.Column(db.String(300))
    difficultyRanking = db.Column(db.Integer)
    professorRanking = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=date.today())

    def __repr__(self):
        return f'<ratesClass email:{self.email} classNum:{self.classNum} subject:{self.subject} review:{self.review} difficultyRanking:{self.difficultyRanking} professorRanking:{self.professorRanking} date:{self.date}>'

# class ratesProf(db.Model):
#     # var count for String foreign keys?
#     email = db.Column(db.String(25), db.ForeignKey('user.email'), primary_key=True)
#     profId = db.Column(db.Integer, db.ForeignKey('professor.profId'), primary_key=True)
#     profRate = db.Column(db.Integer)
#     #comment = db.Column(db.String(300))
#     date = db.Column(db.DateTime, default=date.today())
#
#     def __repr__(self):
#         return f'<ratesProf email:{self.email} profId:{self.profId} profRate:{self.profRate} date:{self.date}>'
#
#     def __repr__(self):
#         return '<ratesProf {}>'.format

class userClass(db.Model):
    # var count for String foreign keys?
    userId = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    email = db.Column(db.String(25), db.ForeignKey('user.email'), primary_key=True)
    classNum = db.Column(db.Integer, db.ForeignKey('class.classNum'), primary_key=True)
    subject = db.Column(db.String(5), db.ForeignKey('class.subject'), primary_key=True)
    section = db.Column(db.Integer, db.ForeignKey('class.section'), primary_key=True)

    def __repr__(self):
        return '<userClass {}>'.format

class friendRequest(db.Model):
    userId = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    friendId = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    status = db.Column(db.String(25))
    time = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        ForeignKeyConstraint(['userId'], ['user.id'], name='friendrequest_user_id_fkey'),
        ForeignKeyConstraint(['friendId'], ['user.id'], name='friendrequest_friend_id_fkey'),
    )

    def __repr__(self):
        return '<friendRequest {}>'.format

class Friend(db.Model):
    userId = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    friendId = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True)
    email = db.Column(db.String, db.ForeignKey('user.email'))

    __table_args__ = (
        ForeignKeyConstraint(['userId'], ['user.id'], name='fk_friend_user_id'),
        ForeignKeyConstraint(['friendId'], ['user.id'], name='fk_friend_friend_id'),
    )

    def __repr__(self):
        return '<Friend {}>'.format