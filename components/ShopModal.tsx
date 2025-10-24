
import React, { useState } from 'react';
import { ShopItem, ItemType } from '../types';
import { playPurchaseSound, playIncorrectSound } from '../utils/audio';

interface ShopModalProps {
    items: ShopItem[];
    suns: number;
    onPurchase: (item: ShopItem) => void;
    onClose: () => void;
    hasPool: boolean;
    isVip: boolean;
    hasTeleporter: boolean;
}

const ShopModal: React.FC<ShopModalProps> = ({ items, suns, onPurchase, onClose, hasPool, isVip, hasTeleporter }) => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'Mejoras': true,
        'Piscinas': true,
        'Objetos': true,
        'Plantas': true,
        'Animales': true,
        'VIP Exclusivo': true,
        'Mis Creaciones': true,
        'Flora Xenomorfa': true,
    });
    
    const handlePurchaseClick = (item: ShopItem) => {
        if (suns < item.cost) {
            playIncorrectSound();
            return;
        }
        if(item.requiresPool && !hasPool) {
            playIncorrectSound();
            alert("¡Necesitas comprar una piscina primero para alojar a este animal!");
            return;
        }
        playPurchaseSound();
        onPurchase(item);
    };
    
    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const renderCategory = (title: string, filter: (item: ShopItem) => boolean) => {
        const filteredItems = items.filter(filter);
        if (filteredItems.length === 0) return null;

        return (
            <div className="mb-4">
                <button onClick={() => toggleCategory(title)} className="w-full text-left text-2xl font-bold text-lime-800 mb-2 bg-lime-300 p-2 rounded-lg flex justify-between items-center">
                    <span>{title}</span>
                    <span>{openCategories[title] ? '−' : '+'}</span>
                </button>
                {openCategories[title] && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map(item => {
                            const canAfford = suns >= item.cost;
                            const isLockedByPool = item.requiresPool && !hasPool;
                            
                            return (
                                <div key={item.id} className={`bg-white/70 p-4 rounded-xl shadow-md flex flex-col items-center relative ${isLockedByPool ? 'grayscale opacity-70' : ''}`}>
                                    {isLockedByPool && <div className="absolute top-2 right-2 text-2xl" title="Necesitas una piscina">🔒</div>}
                                    <div className={`text-6xl mb-2 ${item.type === 'animal' ? 'animate-bounce-slow' : ''}`}>{item.emoji}</div>
                                    <h3 className="text-lg font-bold text-lime-800">{item.name}</h3>
                                    <p className="text-xs text-gray-600 flex-grow mb-2 h-10">{item.description}</p>
                                     <p className="text-sm font-semibold text-gray-700 mb-2">
                                        {item.sunsPerSecond > 0 
                                            ? `Produce: ${item.sunsPerSecond.toLocaleString()}☀️/s` 
                                            : item.growthBoost 
                                            ? `Ayuda: +${item.growthBoost * 100}% Agua`
                                            : 'Especial'}
                                    </p>
                                    <button
                                        onClick={() => handlePurchaseClick(item)}
                                        disabled={!canAfford || isLockedByPool}
                                        className={`w-full font-bold py-2 px-4 rounded-lg text-white transition-transform transform hover:scale-105 shadow-lg ${
                                            isLockedByPool
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : canAfford 
                                            ? 'bg-green-500 hover:bg-green-600' 
                                            : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <span className="flex items-center justify-center">
                                            {item.cost.toLocaleString()} <span className="text-yellow-300 ml-1">☀️</span>
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
            <div className="bg-lime-200 border-4 border-lime-800 rounded-2xl shadow-2xl p-6 text-center max-w-5xl w-full animate-jump-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold text-lime-900">🛍️ Tienda del Jardín</h2>
                     <div className="bg-black/30 p-3 rounded-xl text-2xl font-bold text-white flex items-center shadow-lg">☀️ {Math.floor(suns).toLocaleString()}</div>
                    <button onClick={onClose} className="text-lime-800 hover:text-red-600 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {renderCategory('Mejoras', item => item.type === 'upgrade')}
                    {renderCategory('Piscinas', item => item.type === 'pool')}
                    {renderCategory('Objetos', item => item.type === 'object')}
                    {renderCategory('Plantas', item => item.type === 'plant' && !item.requiresVip && !item.isCustom)}
                    {renderCategory('Animales', item => item.type === 'animal' && !item.requiresVip)}
                    {isVip && renderCategory('⭐ VIP Exclusivo', item => item.requiresVip === true && !items.find(x => x.id === 200 || x.id === 201)?.name.includes(item.name)) }
                    {hasTeleporter && renderCategory('🌌 Flora Xenomorfa', item => items.find(x => x.id === 200 || x.id === 201)?.name.includes(item.name))}
                    {renderCategory('💡 Mis Creaciones', item => item.isCustom === true)}
                </div>
            </div>
        </div>
    );
};

export default ShopModal;
