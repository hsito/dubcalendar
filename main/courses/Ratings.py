from flask import Blueprint, jsonify

ratings_bp = Blueprint('ratings', __name__)

class Ratings:
    """
    A class that is used for user ratings
    """
    review: str
    dif_rank: int
    prof_rank: int
    # instance vars

    def __init__(self, rev: str, dif: int, prof: int):
        """

        :param rev: Review variable allows user to submit a long string as a review of the course
        :param dif: Difficulty of class ranking from 1-5(easy - hard)
        :param prof: Professor ranking from 1-5 (bad - good)
        """
        self.review = rev
        self.dif_rank = dif
        self.prof_rank = prof
