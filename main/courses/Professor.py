from flask import Blueprint, jsonify

professor_bp = Blueprint('professor', __name__)

class Professor:
    """
    A class that is used for Professor information
    """
    profId: int
    subject: str
    profFname: str
    profLname: str

    def __init__(self, profId: int, subject: str, profFname: str, profLname: str):
        """
        :param profId: Number used to identify professor
        :param subject: Subject the professor teaches
        :param profFname: Professor's firstname
        :param profLname: Professor's Lastname
        """
        self.profId = profId
        self.subject = subject
        self.profFname = profFname
        self.profLname = profLname
