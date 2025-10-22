import React from 'react';
import { FINGER_MAP } from '../constants';

interface TypingHandsProps {
  targetKey: string;
}

const TypingHands: React.FC<TypingHandsProps> = ({ targetKey }) => {
  const activeFinger = FINGER_MAP[targetKey.toLowerCase()] || null;

  const getFingerClass = (finger: string) => {
    let classes = 'transition-all duration-200 ease-in-out';

    const isActive = activeFinger === finger || (activeFinger === 'thumbs' && finger.includes('thumb'));

    if (isActive) {
      return `${classes} fill-red-500/80 stroke-red-600 stroke-[3px] drop-shadow-[0_5px_5px_rgba(239,68,68,0.5)]`;
    }
    
    // Dim the non-active hand
    if (activeFinger) {
        if (activeFinger.startsWith('left') && finger.startsWith('right')) return `${classes} fill-gray-400/20 stroke-gray-500/20 stroke-1`;
        if (activeFinger.startsWith('right') && finger.startsWith('left')) return `${classes} fill-gray-400/20 stroke-gray-500/20 stroke-1`;
    }
    
    return `${classes} fill-gray-400/50 stroke-gray-500/60 stroke-2`;
  };

  return (
    <div className="absolute inset-x-0 top-0 h-full flex justify-center items-start pointer-events-none -mt-4 sm:-mt-8 z-10">
      <svg
        width="100%"
        height="350"
        viewBox="0 0 800 350"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-4xl"
        aria-hidden="true"
      >
        <defs>
          <filter id="hand-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Left Hand - Positioned over ASDF */}
        <g id="left-hand" transform="translate(-40, 20)" style={{ filter: 'url(#hand-shadow)' }}>
          {/* Palm */}
          <path d="M210,235 C175,280 120,285 90,240 L100,160 C105,130 160,110 215,120 L245,140 C280,155 270,210 210,235 Z" className="fill-gray-400/40" />
          {/* Fingers */}
          <path className={getFingerClass('left-pinky')} d="M100,165 C80,120 100,90 115,95 L125,160 C110,165 105,160 100,165 Z" />
          <path className={getFingerClass('left-ring')} d="M130,140 C120,80 140,60 155,65 L165,135 C150,145 135,145 130,140 Z" />
          <path className={getFingerClass('left-middle')} d="M170,135 C160,65 180,45 195,50 L205,130 C190,140 175,140 170,135 Z" />
          <path className={getFingerClass('left-index')} d="M215,125 C210,65 225,50 240,55 L250,125 C235,130 220,130 215,125 Z" />
          {/* Thumb */}
          <path className={getFingerClass('left-thumb')} d="M255,145 C290,140 310,160 300,190 L260,210 C240,190 240,155 255,145 Z" />
        </g>
        
        {/* Right Hand - Positioned over JKLÑ. Mirrored and shifted. */}
        <g id="right-hand" transform="translate(840, 20) scale(-1, 1)" style={{ filter: 'url(#hand-shadow)' }}>
          {/* Palm */}
          <path d="M210,235 C175,280 120,285 90,240 L100,160 C105,130 160,110 215,120 L245,140 C280,155 270,210 210,235 Z" className="fill-gray-400/40" />
          {/* Fingers */}
          <path className={getFingerClass('right-pinky')} d="M100,165 C80,120 100,90 115,95 L125,160 C110,165 105,160 100,165 Z" />
          <path className={getFingerClass('right-ring')} d="M130,140 C120,80 140,60 155,65 L165,135 C150,145 135,145 130,140 Z" />
          <path className={getFingerClass('right-middle')} d="M170,135 C160,65 180,45 195,50 L205,130 C190,140 175,140 170,135 Z" />
          <path className={getFingerClass('right-index')} d="M215,125 C210,65 225,50 240,55 L250,125 C235,130 220,130 215,125 Z" />
          {/* Thumb */}
          <path className={getFingerClass('right-thumb')} d="M255,145 C290,140 310,160 300,190 L260,210 C240,190 240,155 255,145 Z" />
        </g>
      </svg>
    </div>
  );
};

export default TypingHands;