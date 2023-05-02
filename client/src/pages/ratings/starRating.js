import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function StarRating({ rating }) {
  // round the rating to the nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  // calculate the number of filled stars
  const filledStars = Math.floor(roundedRating);
  // calculate the number of half-filled stars
  const halfFilledStars = Math.ceil(roundedRating) - filledStars;
  // calculate the number of empty stars
  const emptyStars = 5 - filledStars - halfFilledStars;

  // create an array of stars, with the appropriate number filled, half-filled, or empty
  const stars = [];
  for (let i = 0; i < filledStars; i++) {
    stars.push(<FaStar key={i} />);
  }
  for (let i = 0; i < halfFilledStars; i++) {
    stars.push(<FaStarHalfAlt key={filledStars + i} />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={filledStars + halfFilledStars + i} />);
  }

  // render the stars
  return <div>{stars}</div>;
}

export default StarRating;