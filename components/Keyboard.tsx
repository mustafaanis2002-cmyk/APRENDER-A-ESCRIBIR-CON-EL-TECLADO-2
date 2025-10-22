
import React from 'react';
import { KEYBOARD_LAYOUT } from '../constants';

interface KeyboardProps {
  targetKey: string;
  pressedKey: string | null;
}

const Keyboard: React.FC<KeyboardProps> = ({ targetKey, pressedKey }) => {
  const getKeyClass = (key: string) => {
    const isTarget = key.toLowerCase() === targetKey.toLowerCase();
    const isPressed = key.toLowerCase() === pressedKey?.toLowerCase();
    
    let baseClass = 'font-mono font-bold rounded-lg shadow-md transition-all duration-100 flex items-center justify-center transform';
    
    if (key === ' ') {
      baseClass += ' col-span-5 h-14';
    } else {
      baseClass += ' h-14 w-14 sm:h-16 sm:w-16';
    }

    if (isTarget) {
      return `${baseClass} bg-red-500 text-white scale-110 shadow-lg border-2 border-red-700 animate-pulse`;
    }
    
    if (isPressed) {
      return `${baseClass} bg-blue-400 text-white scale-95`;
    }

    return `${baseClass} bg-white text-gray-700 hover:bg-gray-200 border border-gray-300`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-200 rounded-xl shadow-inner">
      <div className="flex flex-col items-center gap-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-2 ${rowIndex === 3 ? 'w-full justify-center' : ''}`}>
            {row.map((key) => (
              <div
                key={key}
                className={getKeyClass(key)}
                style={key === ' ' ? { gridColumn: 'span 5 / span 5' } : {}}
              >
                {key === ' ' ? 'Espacio' : key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
