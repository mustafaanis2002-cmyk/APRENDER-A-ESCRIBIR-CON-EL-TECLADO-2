// Fix: Create the NameInputScreen component.
import React, { useState, useEffect } from 'react';
import { speak } from '../utils/audio';

interface NameInputScreenProps {
  onNameSubmit: (name: string) => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    speak('¿Cómo te llamas? Escribe tu nombre para guardar tu puntuación.');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-lg transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">¡Bienvenido!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Escribe tu nombre para que podamos guardar tu progreso en el ranking.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={15}
            className="w-full max-w-xs text-center text-2xl p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            ¡Guardar y Jugar!
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputScreen;
