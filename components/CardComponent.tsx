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
      className={`relative w-[160px] h-[400px] perspective-1000 cursor-pointer transition-transform duration-300 ${card.isMatched ? 'z-20' : 'hover:scale-105 active:scale-95'}`}
      onClick={handleClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${card.isMatched ? 'animate-match' : ''}`}>
        
        {/* Front Face (Card Back) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-800 flex flex-col items-center justify-center border-2 border-white/20 shadow-lg z-10 p-4">
           <i className="fas fa-brain text-white text-5xl opacity-40 mb-4"></i>
           <div className="h-1/2 w-px bg-white/10 rounded-full"></div>
        </div>

        {/* Back Face (Card Image) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden bg-white border-2 border-indigo-400 shadow-xl z-0 flex items-center justify-center p-4">
          <img 
            src={card.imageUrl} 
            alt="memory card" 
            className="w-full h-full object-contain pointer-events-none"
            loading="eager"
          />
        </div>

      </div>
    </div>
  );
};

export default CardComponent;