import React from 'react';
import { GardenItem, ShopItem } from '../types';

interface AlmanacModalProps {
    discoveredItems: GardenItem[];
    allItems: ShopItem[];
    onClose: () => void;
}

const AlmanacModal: React.FC<AlmanacModalProps> = ({ discoveredItems, allItems, onClose }) => {
    const discoveredNames = new Set(discoveredItems.map(item => item.name));
    
    const plantItems = allItems.filter(item => (item.type === 'plant' || item.type === 'special_plant') && !item.isCustom);
    const animalItems = allItems.filter(item => item.type === 'animal');
    
    const discoveredPlantsCount = plantItems.filter(p => discoveredNames.has(p.name)).length;
    const discoveredAnimalsCount = animalItems.filter(a => discoveredNames.has(a.name)).length;

    const renderCollection = (title: string, items: ShopItem[]) => (
        <div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">{title}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {items.map(item => {
                    const isDiscovered = discoveredNames.has(item.name);
                    return (
                        <div key={item.id} className={`p-2 rounded-lg text-center transition-all ${isDiscovered ? 'bg-green-100' : 'bg-gray-200'}`}>
                            <div className={`text-4xl transition-transform duration-300 ${isDiscovered ? 'scale-100' : 'scale-90 grayscale'}`}>{item.emoji}</div>
                            <p className={`text-xs mt-1 font-semibold ${isDiscovered ? 'text-green-800' : 'text-gray-500'}`}>{isDiscovered ? item.name : '???'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-amber-100 border-4 border-amber-800 rounded-2xl shadow-2xl p-6 text-center max-w-2xl w-full animate-jump-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold text-amber-900" style={{ fontFamily: "'Fredoka', sans-serif" }}>📖 Almanaque del Jardinero</h2>
                    <button
                        onClick={onClose}
                        className="text-amber-800 hover:text-red-600 transition-colors"
                        aria-label="Cerrar almanaque"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4 bg-white/50 p-3 rounded-lg flex justify-around">
                    <div>
                        <p className="text-lg text-amber-800">Plantas Descubiertas</p>
                        <p className="font-bold text-2xl">{discoveredPlantsCount} / {plantItems.length}</p>
                    </div>
                     <div>
                        <p className="text-lg text-amber-800">Animales Descubiertos</p>
                        <p className="font-bold text-2xl">{discoveredAnimalsCount} / {animalItems.length}</p>
                    </div>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {renderCollection('Plantas', plantItems)}
                    {renderCollection('Animales', animalItems)}
                </div>

            </div>
        </div>
    );
};

export default AlmanacModal;
