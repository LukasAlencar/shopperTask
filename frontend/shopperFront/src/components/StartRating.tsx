import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState<number>(0); // Valor do rating atual

  return (
    <div className='flex'>
      {Array.from({ length: 5 }).map((_, index) => ( 
        <FaStar
          key={index}
          size={20}
          color={index < totalStars ? '#ffd700' : '#d3d3d3'} 
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
};

export default StarRating;
