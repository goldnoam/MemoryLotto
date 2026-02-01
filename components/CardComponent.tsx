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
      className={`relative w-full h-[650px] max-h-[75vh] perspective-2000 cursor-pointer transition-all duration-500 ${card.isMatched ? 'z-20' : 'hover:-translate-y-4 active:scale-95'}`}
      onClick={handleClick}
    >
      <div className={`relative w-full h-full transition-transform duration-700 preserve-3d shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[3rem] ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''} ${card.isMatched ? 'animate-match' : ''}`}>
        
        {/* Front Face (Exquisite Card Back) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center border-[6px] border-white/5 shadow-inner z-10 overflow-hidden">
           {/* Decorative patterns */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rotate-12 border-[1px] border-white/20"></div>
             <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] -rotate-12 border-[1px] border-white/20"></div>
           </div>
           
           <div className="relative z-20 flex flex-col items-center">
             <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center shadow-2xl border border-white/10">
               <i className="fas fa-gem text-white/40 text-4xl animate-pulse"></i>
             </div>
             <div className="h-40 w-[2px] bg-gradient-to-b from-cyan-500/50 to-transparent rounded-full"></div>
           </div>
        </div>

        {/* Back Face (High-End Image Presentation) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[3rem] overflow-hidden bg-white border-[8px] border-slate-900/10 shadow-2xl z-0 flex flex-col p-2">
          <div className="flex-1 w-full bg-slate-50 rounded-[2.5rem] flex items-center justify-center p-10 shadow-inner overflow-hidden">
            <img 
              src={card.imageUrl} 
              alt="gallery item" 
              className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-700 hover:scale-110"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
              loading="eager"
            />
          </div>
          
          {/* Gallery Label style footer */}
          <div className="h-16 flex items-center justify-center px-6">
             <div className="w-12 h-1 bg-slate-200 rounded-full opacity-50"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardComponent;