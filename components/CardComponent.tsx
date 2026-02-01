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
      className={`relative w-full h-[600px] perspective-1000 cursor-pointer transition-transform duration-300 ${card.isMatched ? 'z-20' : 'hover:scale-105 active:scale-95'}`}
      onClick={handleClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${card.isMatched ? 'animate-match' : ''}`}>
        
        {/* Front Face (Card Back) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-800 to-indigo-900 flex flex-col items-center justify-center border-4 border-white/20 shadow-2xl z-10 p-6">
           <div className="flex-1 flex items-center justify-center w-full">
             <i className="fas fa-brain text-white text-7xl opacity-40 animate-pulse"></i>
           </div>
           <div className="w-16 h-1.5 bg-white/20 rounded-full mb-8 shadow-inner"></div>
           <div className="h-1/3 w-1 bg-gradient-to-b from-white/10 to-transparent rounded-full"></div>
        </div>

        {/* Back Face (Card Image) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[2.5rem] overflow-hidden bg-white border-4 border-indigo-400 shadow-2xl z-0 flex flex-col items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={card.imageUrl} 
              alt="memory card" 
              className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
              loading="eager"
            />
          </div>
          {/* Subtle identifier for debug or accessibility if needed */}
          <div className="mt-4 opacity-5 text-[8px] font-mono">{card.pairId}</div>
        </div>

      </div>
    </div>
  );
};

export default CardComponent;