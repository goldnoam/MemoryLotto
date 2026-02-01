
import React from 'react';
import { Card } from '../types';

interface CardComponentProps {
  card: Card;
  onClick: (id: number) => void;
  disabled: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div 
      className={`relative w-full aspect-square perspective-1000 cursor-pointer transition-transform duration-300 ${card.isMatched ? 'opacity-60 grayscale-[0.2]' : 'hover:scale-105'}`}
      onClick={handleClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${card.isMatched ? 'animate-match' : ''}`}>
        {/* Front Face (Hidden initially) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center border-2 border-white/20 shadow-lg">
           <i className="fas fa-brain text-white text-3xl opacity-30"></i>
        </div>

        {/* Back Face (The Image) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-white border-2 border-indigo-400 shadow-xl">
          <img 
            src={card.imageUrl} 
            alt="memory card" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
