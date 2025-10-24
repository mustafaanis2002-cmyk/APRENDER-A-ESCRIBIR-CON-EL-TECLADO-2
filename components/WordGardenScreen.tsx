
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEFENSE_WORDS, SHOP_ITEMS, GARDEN_UNLOCK_COSTS } from '../constants';
import { Garden, GardenItem, ShopItem, ItemSize, GrowthStage } from '../types';
import { playPlantSound, playSellSound, playPurchaseSound, playWateringSound } from '../utils/audio';
import { saveFullGardenState, loadFullGardenState, FullGardenState } from '../utils/storage';
import ShopModal from './ShopModal';
import Keyboard from './Keyboard';
import TypingHands from './TypingHands';
import AdminPanelModal from './AdminPanelModal';
import AlmanacModal from './AlmanacModal';

type CursorMode = 'place' | 'sell' | 'water' | 'fuse';

const WordGardenScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    // --- Core Game State ---
    const [suns, setSuns] = useState(500);
    const [water, setWater] = useState(10);
    const [gardens, setGardens] = useState<Garden[]>([{ id: 1, items: [] }]);
    const [currentGardenId, setCurrentGardenId] = useState(1);
    const [almanacDiscovered, setAlmanacDiscovered] = useState<number[]>([]);
    
    // --- Progression State ---
    const [isVip, setIsVip] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBioEngineer, setIsBioEngineer] = useState(false);
    const [hasTeleporter, setHasTeleporter] = useState(false);
    const [customPlants, setCustomPlants] = useState<ShopItem[]>([]);
    
    // --- UI & Interaction State ---
    const [showShop, setShowShop] = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showAlmanac, setShowAlmanac] = useState(false);
    const [cursorMode, setCursorMode] = useState<CursorMode>('place');
    const [showTypingPanel, setShowTypingPanel] = useState(true);
    const [fuseFirstItem, setFuseFirstItem] = useState<GardenItem | null>(null);
    const [timeOfDay, setTimeOfDay] = useState<'day' | 'evening' | 'night'>('day');

    // --- Dynamic Events State ---
    const [goldenSuns, setGoldenSuns] = useState<{ id: number, x: number, y: number }[]>([]);
    const [pests, setPests] = useState<{ id: number, gardenItemId: number }[]>([]);

    // --- Typing State ---
    const [currentWord, setCurrentWord] = useState('');
    const [typedValue, setTypedValue] = useState('');
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    // --- Refs ---
    const gameLoopRef = useRef<number>();
    const saveStateRef = useRef<number>();
    const eventsRef = useRef<number>();
    const timeOfDayRef = useRef<number>();

    const currentGarden = gardens.find(g => g.id === currentGardenId) as Garden;
    const hasPool = currentGarden.items.some(item => item.type === 'pool');
    
    const allShopItems = [...SHOP_ITEMS, ...customPlants];

    // --- Initialization ---
    useEffect(() => {
        const loadedState = loadFullGardenState();
        if (loadedState) {
            setSuns(loadedState.suns);
            setWater(loadedState.water);
            setGardens(loadedState.gardens);
            setAlmanacDiscovered(loadedState.almanacDiscovered);
            setIsVip(loadedState.isVip);
            setIsAdmin(loadedState.isAdmin);
            setIsBioEngineer(loadedState.isBioEngineer);
            setHasTeleporter(loadedState.hasTeleporter);
            setCustomPlants(loadedState.customPlants);
        }
        setupNewWord();
    }, []);

    // --- Game Loop (Passive Income, Events, Time) ---
    useEffect(() => {
        const loop = () => {
            let sunsGenerated = 0;
            let totalBoost = 1;
            gardens.forEach(garden => {
                garden.items.forEach(item => {
                    if (item.type === 'object' && item.name === 'Tótem Solar') {
                        totalBoost += 0.05;
                    }
                });
            });

            gardens.forEach(garden => {
                const gardenPestIds = pests.map(p => p.gardenItemId);
                garden.items.forEach(item => {
                    if (item.growthStage === 'full' && !gardenPestIds.includes(item.instanceId)) {
                        sunsGenerated += item.sunsPerSecond;
                    }
                });
            });
            setSuns(prev => prev + (sunsGenerated * totalBoost));
        };
        gameLoopRef.current = window.setInterval(loop, 1000);

        const eventRunner = () => {
            // Golden Sun
            if (Math.random() < 0.01) { // 1% chance every 10 seconds
                 setGoldenSuns(prev => [...prev, {id: Date.now(), x: Math.random() * 90 + 5, y: Math.random() * 70 + 5}]);
            }
            // Pest Attack
            const maturePlants = currentGarden.items.filter(i => i.growthStage === 'full');
            if (maturePlants.length > 2 && Math.random() < 0.05) { // 5% chance
                const target = maturePlants[Math.floor(Math.random() * maturePlants.length)];
                if (!pests.some(p => p.gardenItemId === target.instanceId)) {
                    setPests(prev => [...prev, {id: Date.now(), gardenItemId: target.instanceId}]);
                }
            }
        };
        eventsRef.current = window.setInterval(eventRunner, 10000);

        const timeChanger = () => {
            setTimeOfDay(current => {
                if (current === 'day') return 'evening';
                if (current === 'evening') return 'night';
                return 'day';
            })
        };
        timeOfDayRef.current = window.setInterval(timeChanger, 60000); // Change every minute

        return () => {
            clearInterval(gameLoopRef.current);
            clearInterval(eventsRef.current);
            clearInterval(timeOfDayRef.current);
        };
    }, [gardens, pests, currentGarden.items]);

    // --- State Saving ---
    useEffect(() => {
        if (saveStateRef.current) clearTimeout(saveStateRef.current);
        saveStateRef.current = window.setTimeout(() => {
            const stateToSave: FullGardenState = { 
                suns, water, gardens, almanacDiscovered, isVip, isAdmin, isBioEngineer, hasTeleporter, customPlants 
            };
            saveFullGardenState(stateToSave);
        }, 3000);
        return () => clearTimeout(saveStateRef.current);
    }, [suns, water, gardens, almanacDiscovered, isVip, isAdmin, isBioEngineer, hasTeleporter, customPlants]);
    
    // --- Typing Logic ---
    const setupNewWord = useCallback(() => {
        setCurrentWord(DEFENSE_WORDS[Math.floor(Math.random() * DEFENSE_WORDS.length)]);
        setTypedValue('');
    }, []);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!showTypingPanel || showShop || showAdminPanel || showAlmanac || e.key.length > 1) return;
        
        const key = e.key.toLowerCase();
        setPressedKey(key);
        setTimeout(() => setPressedKey(null), 150);
        
        if (key === currentWord[typedValue.length]) {
            const newTypedValue = typedValue + key;
            setTypedValue(newTypedValue);

            if (newTypedValue === currentWord) {
                let sunsEarned = currentWord.length * 10;
                const hasGnome = gardens.some(g => g.items.some(i => i.name === 'Gnomo de la Suerte'));
                if (hasGnome && Math.random() < 0.1) { // 10% chance
                    sunsEarned *= 2;
                }
                setSuns(prev => prev + sunsEarned);
                setupNewWord();
            }
        }
    }, [currentWord, typedValue, setupNewWord, showTypingPanel, showShop, showAdminPanel, showAlmanac, gardens]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const updateGardenItem = (instanceId: number, updates: Partial<GardenItem>) => {
        setGardens(prevGardens => prevGardens.map(g => 
            g.id === currentGardenId 
            ? { ...g, items: g.items.map(i => i.instanceId === instanceId ? { ...i, ...updates } : i) }
            : g
        ));
    };
    
    // --- Core Game Actions ---
    const handleItemClick = (item: GardenItem, e: React.MouseEvent) => {
        e.stopPropagation();
        switch (cursorMode) {
            case 'sell':
                const shopItem = allShopItems.find(s => s.id === item.shopId);
                const sellPrice = Math.floor((shopItem?.cost || 0) / 2);
                setSuns(prev => prev + sellPrice);
                setGardens(gs => gs.map(g => g.id === currentGardenId ? {...g, items: g.items.filter(i => i.instanceId !== item.instanceId)} : g));
                playSellSound();
                break;
            case 'water':
                if (water > 0 && item.growthStage !== 'full') {
                    playWateringSound();
                    setWater(w => w - 1);
                    if (item.growthStage === 'seed') {
                        updateGardenItem(item.instanceId, { growthStage: 'sprout' });
                    } else if (item.growthStage === 'sprout') {
                        updateGardenItem(item.instanceId, { growthStage: 'full' });
                    }
                }
                break;
            case 'fuse':
                if (item.growthStage !== 'full') return;
                if (!fuseFirstItem) {
                    setFuseFirstItem(item);
                } else if (fuseFirstItem.instanceId !== item.instanceId && fuseFirstItem.shopId === item.shopId) {
                    const nextItemId = item.shopId + 1;
                    const nextShopItem = allShopItems.find(s => s.id === nextItemId && s.type === 'plant');
                    if (nextShopItem) {
                        // Remove both items
                        setGardens(gs => gs.map(g => g.id === currentGardenId ? {...g, items: g.items.filter(i => i.instanceId !== item.instanceId && i.instanceId !== fuseFirstItem.instanceId)} : g));
                        // Add the new one
                        handlePurchase(nextShopItem, true); // true to bypass cost
                    }
                    setFuseFirstItem(null);
                } else {
                    setFuseFirstItem(null); // Deselect
                }
                break;
        }
    };

    const handlePurchase = (item: ShopItem, free = false) => {
        if (!free) {
            if (suns < item.cost) return;
            setSuns(prev => prev - item.cost);
        }
        
        playPurchaseSound();

        if (item.type === 'upgrade') {
            if (item.name === 'Pase VIP') setIsVip(true);
            if (item.name === 'Panel de Creador') setIsAdmin(true);
            if (item.name === 'Pase de Bioingeniero') setIsBioEngineer(true);
            if (item.name === 'Teleportador Interdimensional') setHasTeleporter(true);
            return;
        }

        if (item.name === 'Botella de Agua') {
            setWater(w => w + 1);
            return;
        }

        const newItem: GardenItem = {
            instanceId: Date.now() + Math.random(),
            shopId: item.id,
            name: item.name,
            emoji: item.emoji,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            size: item.size,
            type: item.type,
            sunsPerSecond: item.sunsPerSecond,
            growthStage: item.type === 'plant' ? 'seed' : 'full',
        };
        setGardens(gs => gs.map(g => g.id === currentGardenId ? {...g, items: [...g.items, newItem]} : g));
        if (!almanacDiscovered.includes(item.id)) {
            setAlmanacDiscovered(prev => [...prev, item.id]);
        }
        playPlantSound();
    };

    const handleCreatePlant = (plantData: Omit<ShopItem, 'id' | 'cost' | 'type' | 'isCustom'>) => {
        const newPlant: ShopItem = {
            ...plantData,
            id: 10000 + customPlants.length,
            cost: 0, // Free to place for creator
            type: 'plant',
            isCustom: true,
        };
        setCustomPlants(prev => [...prev, newPlant]);
    };

    const handleUnlockGarden = () => {
        const cost = GARDEN_UNLOCK_COSTS[gardens.length];
        if (suns >= cost) {
            setSuns(s => s - cost);
            setGardens(g => [...g, {id: g.length + 1, items: []}]);
        }
    };
    
    // --- Rendering ---
    const renderItem = (item: GardenItem) => {
        const sizeMap: Record<ItemSize, string> = { sm: 'text-4xl', md: 'text-6xl', lg: 'text-8xl', xl: 'text-9xl', planetary: 'text-9xl' };
        let emoji = item.emoji;
        if (item.growthStage === 'seed') emoji = '🌱';
        if (item.growthStage === 'sprout') emoji = '🌿';

        const isPested = pests.some(p => p.gardenItemId === item.instanceId);
        
        return (
            <div
                key={item.instanceId}
                className={`absolute cursor-pointer transform transition-transform hover:scale-110 z-10 
                    ${cursorMode === 'sell' ? 'animate-pulse' : ''}
                    ${fuseFirstItem?.instanceId === item.instanceId ? 'ring-4 ring-yellow-300 rounded-full' : ''}
                `}
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => handleItemClick(item, e)}
            >
                <div className={`${sizeMap[item.size]} relative ${item.type === 'animal' ? 'animate-bounce-slow' : ''}`}>
                    {emoji}
                    {isPested && <div className="absolute inset-0 text-6xl" onClick={(e) => { e.stopPropagation(); setPests(p => p.filter(pest => pest.gardenItemId !== item.instanceId))}}>🐀</div>}
                </div>
            </div>
        );
    };

    const timeClass = {
        day: 'from-cyan-300 via-sky-400 to-transparent',
        evening: 'from-orange-400 via-pink-500 to-transparent',
        night: 'from-indigo-900 via-black to-transparent',
    }[timeOfDay];

    return (
        <div className="w-screen h-screen bg-green-400 font-mono flex flex-col items-center justify-center overflow-hidden select-none">
            {showShop && <ShopModal items={allShopItems} suns={suns} onPurchase={handlePurchase} onClose={() => setShowShop(false)} hasPool={hasPool} isVip={isVip} hasTeleporter={hasTeleporter} />}
            {showAdminPanel && <AdminPanelModal onCreate={handleCreatePlant} onClose={() => setShowAdminPanel(false)} />}
            {showAlmanac && <AlmanacModal discoveredItems={gardens.flatMap(g => g.items)} allItems={SHOP_ITEMS} onClose={() => setShowAlmanac(false)} />}

            <div className="w-full h-full flex flex-col relative">
                <header className="w-full flex justify-between items-start p-4 z-30 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                       <div className="bg-black/30 p-3 rounded-xl text-3xl font-bold text-white flex items-center shadow-lg">☀️ {Math.floor(suns).toLocaleString()}</div>
                       <div className="bg-black/30 p-3 rounded-xl text-3xl font-bold text-white flex items-center shadow-lg">💧 {water.toLocaleString()}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                         <button onClick={() => setShowShop(true)} className="bg-green-600 text-white font-bold p-3 rounded-xl shadow-lg hover:bg-green-700 transition">🛍️ Tienda</button>
                         <button onClick={() => setCursorMode('sell')} className={`${cursorMode==='sell' ? 'bg-red-700' : 'bg-red-500'} text-white font-bold p-3 rounded-xl shadow-lg hover:bg-red-600 transition`}>💰 Vender</button>
                         <button onClick={() => setCursorMode('water')} className={`${cursorMode==='water' ? 'bg-blue-700' : 'bg-blue-500'} text-white font-bold p-3 rounded-xl shadow-lg hover:bg-blue-600 transition`}>💧 Regar</button>
                         {isBioEngineer && <button onClick={() => { setCursorMode('fuse'); setFuseFirstItem(null); }} className={`${cursorMode==='fuse' ? 'bg-purple-700' : 'bg-purple-500'} text-white font-bold p-3 rounded-xl shadow-lg hover:bg-purple-600 transition`}>🧬 Fusionar</button>}
                         <button onClick={() => setShowAlmanac(true)} className="bg-amber-600 text-white font-bold p-3 rounded-xl shadow-lg hover:bg-amber-700 transition">📖 Almanaque</button>
                         {isAdmin && <button onClick={() => setShowAdminPanel(true)} className="bg-gray-700 text-white font-bold p-3 rounded-xl shadow-lg hover:bg-gray-800 transition">⚙️</button>}
                         <button onClick={onExit} className="bg-gray-500 text-white font-bold p-3 rounded-xl shadow-lg hover:bg-gray-600 transition">Salir</button>
                    </div>
                     <div className="w-full flex gap-2 mt-2">
                        {gardens.map(g => <button key={g.id} onClick={() => setCurrentGardenId(g.id)} className={`p-2 rounded-lg font-bold ${g.id === currentGardenId ? 'bg-yellow-400 text-black' : 'bg-black/30 text-white'}`}>Jardín {g.id}</button>)}
                        {gardens.length < GARDEN_UNLOCK_COSTS.length && <button onClick={handleUnlockGarden} className="p-2 rounded-lg bg-green-700 text-white font-bold">Comprar Jardín {gardens.length + 1} ({GARDEN_UNLOCK_COSTS[gardens.length].toLocaleString()}☀️)</button>}
                     </div>
                </header>

                <main className={`w-full flex-grow relative bg-green-400 overflow-hidden`}>
                     <div className={`absolute inset-0 bg-gradient-to-b ${timeClass} opacity-80 transition-all duration-1000`}></div>
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-green-500 to-transparent"></div>
                    {timeOfDay === 'day' && <div className="absolute top-8 left-8 w-24 h-24 bg-yellow-300 rounded-full shadow-2xl"></div>}
                    {timeOfDay === 'night' && <div className="absolute top-8 left-8 w-24 h-24 bg-gray-200 rounded-full shadow-2xl"></div>}
                    <div className="absolute top-16 right-1/4 w-32 h-16 bg-white rounded-full opacity-80 animate-cloud-slow"></div>
                    <div className="absolute top-32 left-1/4 w-48 h-24 bg-white rounded-full opacity-80 animate-cloud-fast"></div>
                    
                    {currentGarden.items.map(renderItem)}
                    {goldenSuns.map(sun => 
                        <div key={sun.id} className="absolute text-5xl cursor-pointer" style={{left: `${sun.x}%`, top: `${sun.y}%`}} onClick={() => { setSuns(s => s + 500); setGoldenSuns(gs => gs.filter(g => g.id !== sun.id))}}>☀️</div>
                    )}
                </main>

                <div className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-500 ${showTypingPanel ? 'translate-y-0' : 'translate-y-full'}`}>
                     <button onClick={() => setShowTypingPanel(v => !v)} className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800/80 text-white p-2 rounded-t-lg">
                        👁️ {showTypingPanel ? 'Ocultar Teclado' : 'Mostrar Teclado'}
                    </button>
                    <footer className="w-full p-6 bg-gray-800/80 text-center">
                        <div className="relative w-full">
                           <TypingHands targetKey={currentWord[typedValue.length] || ''} />
                           <Keyboard targetKey={currentWord[typedValue.length] || ''} pressedKey={pressedKey} />
                        </div>
                        <p className="text-5xl tracking-widest font-bold text-white mt-4" style={{ textShadow: '2px 2px 4px #000' }}>
                           {currentWord.split('').map((char, index) => (
                                <span key={index} className={index < typedValue.length ? 'text-green-400' : 'text-gray-400'}>{char}</span>
                           ))}
                        </p>
                    </footer>
                </div>
                 {!showTypingPanel && <button onClick={() => setShowTypingPanel(true)} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg animate-bounce z-20">⌨️ Teclear para ganar Soles</button>}
            </div>
            
            <style>{`
                @keyframes cloud-slow { 0% { transform: translateX(-150%); } 100% { transform: translateX(150vw); } }
                .animate-cloud-slow { animation: cloud-slow 120s linear infinite; }
                @keyframes cloud-fast { 0% { transform: translateX(150vw); } 100% { transform: translateX(-150%); } }
                .animate-cloud-fast { animation: cloud-fast 80s linear infinite 5s; }
                 @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }
                .animate-bounce-slow { animation: bounce-slow 3s infinite; }
            `}</style>
        </div>
    );
};

export default WordGardenScreen;
