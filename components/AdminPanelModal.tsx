import React, { useState } from 'react';
import { ShopItem } from '../types';

interface AdminPanelModalProps {
    onCreate: (plant: Omit<ShopItem, 'id' | 'cost' | 'type' | 'isCustom'>) => void;
    onClose: () => void;
}

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onCreate, onClose }) => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('💡');
    const [sunsPerSecond, setSunsPerSecond] = useState(100000);
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !emoji.trim()) {
            setError('El nombre y el emoji no pueden estar vacíos.');
            return;
        }
        onCreate({
            name: name.trim(),
            emoji: emoji,
            description: 'Una planta única creada por ti.',
            sunsPerSecond: Number(sunsPerSecond),
            size: size,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border-4 border-purple-500 text-white rounded-2xl shadow-2xl p-6 max-w-lg w-full animate-jump-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-purple-400">⚙️ Panel de Creador</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Cerrar panel">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-300">Nombre de la Planta</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={25}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ej: Flor de la Noche"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-300">Emoji</label>
                        <input
                            type="text"
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            maxLength={2}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Introduce un emoji"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-300">Soles por Segundo</label>
                         <input
                            type="number"
                            value={sunsPerSecond}
                            onChange={(e) => setSunsPerSecond(Math.max(0, parseInt(e.target.value, 10)))}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-300">Tamaño</label>
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="sm">Pequeño</option>
                            <option value="md">Mediano</option>
                            <option value="lg">Grande</option>
                            <option value="xl">Extra Grande</option>
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform transition"
                        >
                            ¡Crear Planta!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPanelModal;
