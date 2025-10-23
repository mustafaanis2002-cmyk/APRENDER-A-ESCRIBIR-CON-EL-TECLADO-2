import React, { useState, useEffect, useCallback } from 'react';
import { playPlantSound, speak, playIncorrectSound, playCorrectSound, playSellSound, playSkipSound } from '../utils/audio';
import { GardenItem, AnimalItem, ShopItem } from '../types';
import ShopModal from './ShopModal';
import { SHOP_ITEMS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

// --- Fallback Data ---
const FALLBACK_CATEGORIES: { [key: string]: { prompt: string; words: string[] } } = {
  flor: { prompt: "Escribe una flor", words: ['rosa', 'girasol', 'tulipan', 'flor', 'margarita', 'hibisco'] },
  animal_bosque: { prompt: "Escribe un animal del bosque", words: ['zorro', 'oso', 'conejo', 'ciervo', 'buho', 'ardilla'] },
  brilla: { prompt: "Escribe algo que brilla", words: ['sol', 'estrella', 'luna', 'diamante', 'oro', 'fuego'] }
};
const FALLBACK_KEYS = Object.keys(FALLBACK_CATEGORIES);

// --- Component ---
const WordGardenScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [items, setItems] = useState<GardenItem[]>([]);
  const [animals, setAnimals] = useState<AnimalItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<{ prompt: string; words: string[] }>({ prompt: 'Cargando pista...', words: [] });
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
  // Economy and Inventory
  const [suns, setSuns] = useState(50);
  const [wateringCans, setWateringCans] = useState(5);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSellMode, setIsSellMode] = useState(false);
  
  // Placement Mode
  const [itemToPlace, setItemToPlace] = useState<ShopItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchNewPrompt = useCallback(async () => {
    setIsLoadingPrompt(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const promptToAI = `Generate a simple, one-line prompt for a word guessing game for kids in Spanish. The prompt should ask for a type of object, animal, or concept. For example: 'Escribe el nombre de una fruta' or 'Escribe algo que se encuentra en el cielo'. Also provide a list of at least 5 valid, simple, one-word answers in Spanish for that prompt. The response must be a valid JSON object with 'prompt' (string) and 'words' (array of strings) keys.`;
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptToAI,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      prompt: { type: Type.STRING },
                      words: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
              }
          }
      });
      const jsonStr = response.text.trim();
      const newPromptData = JSON.parse(jsonStr);
      newPromptData.words = newPromptData.words.map((w: string) => w.toLowerCase());
      setCurrentPrompt(newPromptData);
    } catch (error) {
      console.error("Error fetching new prompt from AI, using fallback:", error);
      const fallbackKey = FALLBACK_KEYS[Math.floor(Math.random() * FALLBACK_KEYS.length)];
      setCurrentPrompt(FALLBACK_CATEGORIES[fallbackKey]);
    } finally {
      setIsLoadingPrompt(false);
    }
  }, []);

  useEffect(() => {
    fetchNewPrompt();
    speak("Bienvenido a tu Jardín de Palabras. Escribe lo que te pida para ganar soles y comprar plantas.");
  }, [fetchNewPrompt]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setItemToPlace(null);
        };

        if (itemToPlace) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [itemToPlace]);

    useEffect(() => {
        const rabbitCount = animals.filter(a => a.type === 'rabbit').length;
        if (rabbitCount > 0) {
            const interval = setInterval(() => setWateringCans(prev => prev + rabbitCount), 60000);
            return () => clearInterval(interval);
        }
    }, [animals]);

    useEffect(() => {
        const beeCount = animals.filter(a => a.type === 'bee').length;
        if (beeCount > 0) {
            const interval = setInterval(() => setSuns(prev => prev + beeCount), 10000);
            return () => clearInterval(interval);
        }
    }, [animals]);
     useEffect(() => {
        const sunflowerCount = items.filter(i => i.name.toLowerCase() === 'girasol' && i.type === 'special_plant' && i.stage === 'full').length;
        if (sunflowerCount > 0) {
            const interval = setInterval(() => setSuns(prev => prev + sunflowerCount * 5), 30000);
            return () => clearInterval(interval);
        }
    }, [items]);
  
  const handleValidationMessage = (message: string, isError: boolean) => {
    setValidationMessage(message);
    if(isError) playIncorrectSound();
    setTimeout(() => setValidationMessage(null), 2000);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = inputValue.trim().toLowerCase();
    if (!word || isLoadingPrompt) return;

    if (currentPrompt.words.includes(word)) {
      playCorrectSound();
      const sunsEarned = word.length;
      setSuns(prev => prev + sunsEarned);
      handleValidationMessage(`¡Correcto! +${sunsEarned} ☀️`, false);
      setInputValue('');
      fetchNewPrompt();
    } else {
      handleValidationMessage(`'${word}' no es un buen ejemplo. ¡Inténtalo de nuevo!`, true);
    }
  };

  const handleItemClick = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation(); 
    if (itemToPlace) return;

    if (isSellMode) {
      const itemToSell = items.find(i => i.id === itemId);
      if (!itemToSell) return;

      const shopData = SHOP_ITEMS.find(shopItem => shopItem.name === itemToSell.name);
      const sellPrice = Math.floor((shopData?.cost || 0) / 2);

      playSellSound();
      setSuns(prev => prev + sellPrice);
      setItems(prev => prev.filter(i => i.id !== itemId));
      handleValidationMessage(`¡Vendido! +${sellPrice} ☀️`, false);
    } else {
      if (wateringCans <= 0) {
        handleValidationMessage("¡No tienes regaderas! Compra más en la tienda.", true);
        return;
      }
      playPlantSound();
      setWateringCans(prev => prev - 1);
      setItems(prevItems => prevItems.map(item => {
        if (item.id === itemId) {
          if (item.stage === 'seed') return { ...item, stage: 'sprout' };
          if (item.stage === 'sprout') return { ...item, stage: 'full' };
        }
        return item;
      }));
    }
  };

   const handlePlaceItem = (e: React.MouseEvent<HTMLElement>) => {
    if (!itemToPlace) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newItem: GardenItem = {
        id: Date.now(),
        name: itemToPlace.name,
        finalEmoji: itemToPlace.emoji,
        x,
        y,
        stage: itemToPlace.type === 'special_plant' ? 'full' : 'seed',
        type: itemToPlace.type === 'special_plant' ? 'special_plant' : undefined,
    };
    
    setItems(prev => [...prev, newItem]);
    setItemToPlace(null);
    playPlantSound();
  };
  
  const handlePurchase = (item: ShopItem) => {
      if (suns < item.cost) {
          handleValidationMessage("¡No tienes suficientes soles!", true);
          return;
      }
      
      setSuns(prev => prev - item.cost);
      
      if (item.type === 'plant' || item.type === 'special_plant') {
          setItemToPlace(item);
          setIsShopOpen(false);
      } else if (item.type === 'consumable') {
          if(item.id === 'wateringCan') setWateringCans(prev => prev + 1);
      } else if (item.type === 'animal') {
          const newAnimal: AnimalItem = {
              id: Date.now(),
              type: item.id as 'rabbit' | 'bee' | 'butterfly',
              emoji: item.emoji,
              x: 10 + Math.random() * 80,
              y: 20 + Math.random() * 60,
          };
          setAnimals(prev => [...prev, newAnimal]);
      }
  };

  const handleSkip = () => {
      if (isLoadingPrompt) return;
      playSkipSound();
      fetchNewPrompt();
  };

  const getEmojiForStage = (item: GardenItem): string => {
    switch(item.stage) {
        case 'seed': return '🌱';
        case 'sprout': return '🪴';
        case 'full': return item.finalEmoji;
    }
  }

  const getTooltipText = (item: GardenItem): string => {
      if (isSellMode) {
          const shopData = SHOP_ITEMS.find(shopItem => shopItem.name === item.name);
          const sellPrice = Math.floor((shopData?.cost || 0) / 2);
          return `Vender ${item.name} por ${sellPrice} ☀️`;
      }
      if (item.stage !== 'full') {
          return `Regar ${item.stage === 'seed' ? 'semilla' : 'brote'}`;
      }
      return item.name;
  };

  return (
    <div className={`w-screen h-screen bg-sky-200 text-gray-800 font-sans flex flex-col overflow-hidden ${isSellMode ? 'cursor-not-allowed' : ''}`}>
      {isShopOpen && <ShopModal suns={suns} onPurchase={handlePurchase} onClose={() => setIsShopOpen(false)} />}
      
      {itemToPlace && (
        <div className="fixed pointer-events-none z-50 text-5xl" style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}>
            {itemToPlace.emoji}
        </div>
      )}

      {/* HUD */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-2xl font-bold text-yellow-600 flex items-center gap-2">☀️ <span>{suns}</span></div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-2xl font-bold text-blue-600 flex items-center gap-2">💧 <span>{wateringCans}</span></div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
                {animals.filter(a => a.type === 'rabbit').length > 0 && <span>🐰 {animals.filter(a => a.type === 'rabbit').length}</span>}
                {animals.filter(a => a.type === 'bee').length > 0 && <span>🐝 {animals.filter(a => a.type === 'bee').length}</span>}
                {animals.filter(a => a.type === 'butterfly').length > 0 && <span>🦋 {animals.filter(a => a.type === 'butterfly').length}</span>}
            </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setIsShopOpen(true)} className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-xl font-bold transform hover:scale-105 transition">
              Tienda 🏪
          </button>
          <button onClick={() => setIsSellMode(prev => !prev)} className={`text-white px-4 py-3 rounded-full shadow-lg text-2xl font-bold transform hover:scale-105 transition ${isSellMode ? 'bg-red-500' : 'bg-yellow-500'}`}>
              💰
          </button>
        </div>
      </header>

      {/* Garden Area */}
      <main onClick={handlePlaceItem} className={`flex-grow relative bg-lime-100 ${itemToPlace ? 'cursor-copy' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-sky-300 to-sky-100"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-lime-600 to-lime-400"></div>
        
        {items.map(item => (
          <div
            key={item.id}
            className={`absolute text-5xl group animate-jump-in transform hover:scale-110 transition-transform ${isSellMode ? 'cursor-pointer animate-shake' : (itemToPlace ? '' : 'cursor-pointer')}`}
            style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => handleItemClick(e, item.id)}
          >
            {getEmojiForStage(item)}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black/70 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {getTooltipText(item)}
            </span>
          </div>
        ))}
         {animals.map(animal => (
          <div
            key={animal.id}
            className="absolute text-5xl animate-float"
            style={{ left: `${animal.x}%`, top: `${animal.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {animal.emoji}
          </div>
        ))}
      </main>

      {/* Input Area */}
      <footer className="w-full p-4 bg-lime-700/80 backdrop-blur-sm shadow-2xl z-10">
        {itemToPlace && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/50 text-white px-4 py-2 rounded-full z-20">
                Haz clic para plantar tu {itemToPlace.name}. Presiona 'Esc' para cancelar.
            </div>
        )}
        <div className="max-w-xl mx-auto text-center">
            {validationMessage && <p className="text-white font-bold mb-2 animate-bounce">{validationMessage}</p>}
            <p className="text-xl font-semibold text-white mb-2 h-7" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                {isLoadingPrompt ? 'Generando nueva pista...' : currentPrompt.prompt}
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-2xl p-3 border-2 border-lime-800 bg-lime-50 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition disabled:bg-gray-200"
                    autoFocus
                    placeholder={isLoadingPrompt ? '' : "Escribe aquí..."}
                    disabled={isLoadingPrompt}
                />
                <button type="submit" className="bg-yellow-400 text-yellow-900 font-bold p-3 rounded-lg shadow-md hover:bg-yellow-500 transform hover:scale-105 transition disabled:bg-gray-400" disabled={isLoadingPrompt}>
                    Crear
                </button>
                 <button type="button" onClick={handleSkip} className="bg-blue-400 text-white font-bold p-3 rounded-lg shadow-md hover:bg-blue-500 transform hover:scale-105 transition disabled:bg-gray-400" disabled={isLoadingPrompt}>
                    Saltar
                </button>
            </form>
            <div className="flex justify-center gap-4 mt-3">
                <button onClick={onExit} className="text-white/80 hover:text-white transition">Salir</button>
            </div>
        </div>
      </footer>
       <style>{`
        .cursor-copy { cursor: copy !important; }
        @keyframes float {
            0% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
            100% { transform: translate(-50%, -50%) translateY(0px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, -50%) rotate(-2deg); }
            75% { transform: translate(-50%, -50%) rotate(2deg); }
        }
        .animate-shake {
            animation: shake 0.5s ease-in-out infinite;
        }
    `}</style>
    </div>
  );
};

export default WordGardenScreen;