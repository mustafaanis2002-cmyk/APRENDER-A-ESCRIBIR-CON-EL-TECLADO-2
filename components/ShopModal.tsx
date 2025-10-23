import React from 'react';
import { ShopItem } from '../types';
import { playPurchaseSound, playIncorrectSound } from '../utils/audio';
import { SHOP_ITEMS } from '../constants';

interface ShopModalProps {
    suns: number;
    onPurchase: (item: ShopItem) => void;
    onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ suns, onPurchase, onClose }) => {

    const handleBuy = (item: ShopItem) => {
        if (suns >= item.cost) {
            playPurchaseSound();
            onPurchase(item);
        } else {
            playIncorrectSound();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-yellow-100 border-4 border-yellow-800 rounded-2xl shadow-2xl p-6 text-center max-w-md w-full animate-jump-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold text-yellow-900" style={{ fontFamily: "'Fredoka', sans-serif" }}>Tienda</h2>
                    <button
                        onClick={onClose}
                        className="text-yellow-800 hover:text-red-600 transition-colors"
                        aria-label="Cerrar tienda"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6 bg-white/50 p-3 rounded-lg">
                    <p className="text-xl text-yellow-800">Tus Soles: <span className="font-bold text-2xl">{suns} ☀️</span></p>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {SHOP_ITEMS.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">{item.emoji}</span>
                                <div className="text-left">
                                    <p className="text-2xl font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-600">{item.description}</p>
                                    <p className="text-lg font-bold text-yellow-600">{item.cost} ☀️</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleBuy(item)}
                                disabled={suns < item.cost}
                                className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                Comprar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopModal;