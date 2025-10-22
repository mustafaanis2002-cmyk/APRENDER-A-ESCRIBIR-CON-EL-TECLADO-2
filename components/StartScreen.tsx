import React, { useEffect } from 'react';
import { speak } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      speak("¡Hola! ¿Listo para convertirte en un campeón del teclado? ¡Presiona el botón verde para empezar!");
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-lg transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">¡Aprende a Teclear!</h1>
        <p className="text-gray-600 text-lg mb-8">
          ¡Bienvenido al juego de teclado para niños! Presiona las teclas correctas, gana puntos y conviértete en un experto del teclado.
        </p>
        <button
          onClick={onStart}
          className="bg-green-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          ¡Empezar a Jugar!
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
