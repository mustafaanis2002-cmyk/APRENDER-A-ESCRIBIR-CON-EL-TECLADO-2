
import { Level, Opponent, ShopItem } from './types';

export const LEVELS: Level[] = [
  {
    level: 1,
    title: 'Fila de Inicio',
    color: 'bg-green-500',
    challenges: ['asdfg', 'hjklñ', 'asdfghjklñ', 'gfdsa', 'ñlkjh'],
    pointsPerCharacter: 10,
    pointsToUnlock: 0,
  },
  {
    level: 2,
    title: 'Fila Superior',
    color: 'bg-blue-500',
    challenges: ['qwerty', 'uiop', 'poiuyt', 'trewq', 'qwertyuiop'],
    pointsPerCharacter: 12,
    pointsToUnlock: 500,
  },
  {
    level: 3,
    title: 'Fila Inferior',
    color: 'bg-yellow-500',
    challenges: ['zxcvb', 'nm', 'bnm', 'bvcx', 'zxcvbnm'],
    pointsPerCharacter: 15,
    pointsToUnlock: 1500,
  },
  {
    level: 4,
    title: 'Frases Cortas',
    color: 'bg-red-500',
    challenges: ['el sol brilla', 'la casa es azul', 'mi perro juega', 'hola mundo', 'el gato duerme'],
    pointsPerCharacter: 20,
    pointsToUnlock: 3000,
  },
  {
    level: 5,
    title: 'Experto del Teclado',
    color: 'bg-purple-500',
    challenges: ['el rapido zorro marron salta sobre el perro perezoso', 'el veloz murcielago hindu comia feliz cardillo y kiwi'],
    pointsPerCharacter: 25,
    pointsToUnlock: 5000,
  },
];

export const KEYBOARD_LAYOUT: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  [' '],
];

export const FINGER_MAP: { [key: string]: string } = {
  'q': 'left-pinky', 'a': 'left-pinky', 'z': 'left-pinky',
  'w': 'left-ring', 's': 'left-ring', 'x': 'left-ring',
  'e': 'left-middle', 'd': 'left-middle', 'c': 'left-middle',
  'r': 'left-index', 'f': 'left-index', 'v': 'left-index',
  't': 'left-index', 'g': 'left-index', 'b': 'left-index',
  'y': 'right-index', 'h': 'right-index', 'n': 'right-index',
  'u': 'right-index', 'j': 'right-index', 'm': 'right-index',
  'i': 'right-middle', 'k': 'right-middle', ',': 'right-middle',
  'o': 'right-ring', 'l': 'right-ring', '.': 'right-ring',
  'p': 'right-pinky', 'ñ': 'right-pinky', '-': 'right-pinky',
  ' ': 'thumbs',
};

export const FINGER_NAME_MAP: { [key: string]: string } = {
    'left-pinky': 'dedo meñique izquierdo',
    'left-ring': 'dedo anular izquierdo',
    'left-middle': 'dedo medio izquierdo',
    'left-index': 'dedo índice izquierdo',
    'right-index': 'dedo índice derecho',
    'right-middle': 'dedo medio derecho',
    'right-ring': 'dedo anular derecho',
    'right-pinky': 'dedo meñique derecho',
    'thumbs': 'cualquier pulgar',
};

export const OPPONENTS: Opponent[] = [
    { name: 'Tortuga Lenta', icon: '🐢', cps: 1 },
    { name: 'Conejo Veloz', icon: '🐇', cps: 3 },
    { name: 'Cheetah Rayo', icon: '🐆', cps: 5 },
    { name: 'Robot Pro', icon: '🤖', cps: 7 },
];

export const RACE_CHALLENGES: string[] = [
    "la tecnologia es la herramienta que nos permite sonar",
    "aprender a teclear abre un mundo de posibilidades",
    "la practica constante es la clave del exito",
    "cada error es una oportunidad para mejorar",
    "la velocidad sin precision no sirve de mucho",
];

export const GUESS_THE_WORD_WORDS: string[] = [
    "TECLADO", "RATON", "PANTALLA", "JUEGO", "NIVEL",
    "PUNTOS", "MUSICA", "LETRA", "PALABRA", "CASA", "ARBOL",
];

export const DEFENSE_WORDS: string[] = [
    'sol', 'luna', 'estrella', 'cielo', 'nube', 'rio', 'mar',
    'jugar', 'correr', 'saltar', 'reir', 'cantar', 'bailar',
    'amigo', 'familia', 'escuela', 'casa', 'parque', 'libro',
    'rojo', 'azul', 'verde', 'amarillo', 'blanco', 'negro',
];

export const KITCHEN_RECIPES = [
    { name: 'Ensalada', emoji: '🥗', ingredients: ['lechuga', 'tomate', 'pepino'], timeLimit: 45 },
    { name: 'Pizza', emoji: '🍕', ingredients: ['masa', 'queso', 'tomate', 'jamon'], timeLimit: 60 },
    { name: 'Taco', emoji: '🌮', ingredients: ['tortilla', 'carne', 'queso', 'salsa'], timeLimit: 50 },
    { name: 'Pastel', emoji: '🍰', ingredients: ['harina', 'azucar', 'huevo', 'leche'], timeLimit: 70 },
];

export const GARDEN_UNLOCK_COSTS = [0, 10000000, 500000000, 10000000000]; // Jardín 1 es gratis

export const SHOP_ITEMS: ShopItem[] = [
    // --- Upgrades ---
    { id: 9000, name: 'Pase VIP', emoji: '⭐', description: 'Desbloquea plantas y animales VIP exclusivos en la tienda.', cost: 5000000, sunsPerSecond: 0, type: 'upgrade', size: 'sm' },
    { id: 9001, name: 'Panel de Creador', emoji: '⚙️', description: '¡El poder definitivo! Te permite crear tus propias plantas personalizadas.', cost: 250000000, sunsPerSecond: 0, type: 'upgrade', size: 'sm' },
    { id: 9002, name: 'Pase de Bioingeniero', emoji: '🧬', description: 'Desbloquea el Modo Fusión para combinar dos plantas idénticas en una de nivel superior.', cost: 100000000, sunsPerSecond: 0, type: 'upgrade', size: 'sm' },
    { id: 9003, name: 'Teleportador Interdimensional', emoji: '🌀', description: 'Viaja a un nuevo mundo y desbloquea la flora exótica. ¡El desafío final!', cost: 1000000000000, sunsPerSecond: 0, type: 'upgrade', size: 'lg' },

    // --- Pools ---
    { id: 3001, name: 'Estanque', emoji: '🏞️', description: 'Necesario para comprar animales acuáticos básicos.', cost: 50000, sunsPerSecond: 0, type: 'pool', size: 'lg' },
    { id: 3002, name: 'Piscina de Lujo', emoji: '🌊', description: 'Necesaria para comprar animales acuáticos avanzados.', cost: 1000000, sunsPerSecond: 0, type: 'pool', size: 'xl' },

    // --- Objects ---
    { id: 8000, name: 'Botella de Agua', emoji: '💧', description: 'Necesaria para regar y hacer crecer tus plantas. ¡Compra en cantidad!', cost: 50, sunsPerSecond: 0, type: 'object', size: 'sm' },
    { id: 8001, name: 'Tótem Solar', emoji: '🗿', description: 'Aumenta la producción de soles de TODAS las plantas en un 5%. ¡Acumulable!', cost: 10000000, sunsPerSecond: 0, type: 'object', size: 'md' },
    { id: 8002, name: 'Aspersor Automático', emoji: '💦', description: 'Riega una planta al azar cada 5 minutos, ¡gratis!', cost: 50000000, sunsPerSecond: 0, type: 'object', size: 'md' },
    { id: 8003, name: 'Gnomo de la Suerte', emoji: '🧑‍🌾', description: 'Da una pequeña probabilidad de duplicar los soles ganados al teclear.', cost: 2500000, sunsPerSecond: 0, type: 'object', size: 'sm' },

    // --- Plantas ---
    { id: 1, name: 'Margarita', emoji: '🌼', description: 'Una flor simple y feliz.', cost: 150, sunsPerSecond: 1, type: 'plant', size: 'sm' },
    { id: 2, name: 'Girasol', emoji: '🌻', description: 'Siempre mira hacia el sol.', cost: 500, sunsPerSecond: 5, type: 'plant', size: 'md' },
    { id: 3, name: 'Rosal', emoji: '🌹', description: 'Clásica y elegante.', cost: 1200, sunsPerSecond: 10, type: 'plant', size: 'md' },
    { id: 4, name: 'Árbol', emoji: '🌳', description: 'Da sombra y tranquilidad.', cost: 5000, sunsPerSecond: 40, type: 'plant', size: 'lg' },
    { id: 5, name: 'Seta', emoji: '🍄', description: 'Crece en lugares húmedos.', cost: 300, sunsPerSecond: 3, type: 'plant', size: 'sm' },
    { id: 6, name: 'Cactus', emoji: '🌵', description: '¡Cuidado, pincha!', cost: 2500, sunsPerSecond: 20, type: 'plant', size: 'md' },
    { id: 7, name: 'Bambú', emoji: '🎍', description: 'Crece muy rápido.', cost: 7500, sunsPerSecond: 60, type: 'plant', size: 'lg' },
    { id: 8, name: 'Tulipán', emoji: '🌷', description: 'Anuncia la primavera.', cost: 800, sunsPerSecond: 7, type: 'plant', size: 'sm' },
    { id: 9, name: 'Zanahoria', emoji: '🥕', description: 'Buena para la vista.', cost: 1000, sunsPerSecond: 8, type: 'plant', size: 'sm' },
    { id: 10, name: 'Maíz', emoji: '🌽', description: '¡Palomitas!', cost: 10000, sunsPerSecond: 80, type: 'plant', size: 'md' },
    { id: 11, name: 'Calabaza', emoji: '🎃', description: 'Perfecta para Halloween.', cost: 20000, sunsPerSecond: 150, type: 'plant', size: 'lg' },
    { id: 12, name: 'Bonsái', emoji: ' bonsai ', description: 'Un arte milenario.', cost: 50000, sunsPerSecond: 350, type: 'plant', size: 'md' },
    { id: 13, name: 'Cerezo en Flor', emoji: '🌸', description: 'Belleza efímera.', cost: 150000, sunsPerSecond: 1000, type: 'plant', size: 'lg' },
    { id: 14, name: 'Planta Carnívora', emoji: '🪴', description: 'Mejor no acercar el dedo.', cost: 300000, sunsPerSecond: 2200, type: 'plant', size: 'md' },
    { id: 15, name: 'Flor Lunar', emoji: '💮', description: 'Brilla en la oscuridad.', cost: 1000000, sunsPerSecond: 7000, type: 'plant', size: 'md' },
    { id: 16, name: 'Árbol de Estrellas', emoji: '🌠', description: 'Sus frutos son estrellas.', cost: 7500000, sunsPerSecond: 50000, type: 'plant', size: 'lg' },
    { id: 17, name: 'Corazón del Volcán', emoji: '🌋', description: 'Caliente, caliente.', cost: 20000000, sunsPerSecond: 130000, type: 'plant', size: 'lg' },
    { id: 18, name: 'Brote de Amatista', emoji: '🔮', description: 'Una gema viviente.', cost: 45000000, sunsPerSecond: 280000, type: 'plant', size: 'sm' },
    { id: 19, name: 'Rosa de Rubí', emoji: '💎', description: 'Tan bella como valiosa.', cost: 100000000, sunsPerSecond: 600000, type: 'plant', size: 'md' },
    { id: 20, name: 'Árbol de Caramelo', emoji: '🍬', description: 'Dulce y pegajoso.', cost: 800000, sunsPerSecond: 5500, type: 'plant', size: 'lg' },
    { id: 21, name: 'Arbusto de Algodón', emoji: '☁️', description: 'Suave como una nube.', cost: 2500000, sunsPerSecond: 16000, type: 'plant', size: 'md' },
    { id: 22, name: 'Llama Eterna', emoji: '🔥', description: 'Una planta que nunca se apaga.', cost: 50000000, sunsPerSecond: 320000, type: 'plant', size: 'md' },
    { id: 23, name: 'Géiser en Maceta', emoji: '⛲', description: 'Erupciona soles cada cierto tiempo.', cost: 120000000, sunsPerSecond: 700000, type: 'plant', size: 'lg' },
    
    // --- Planetary Collection ---
    { id: 100, name: 'Musgo Marciano', emoji: '🪐', description: 'Directo del planeta rojo.', cost: 500000000, sunsPerSecond: 3000000, type: 'plant', size: 'planetary' },
    { id: 101, name: 'Flor Venusiana', emoji: '♀️', description: 'Belleza tóxica y rentable.', cost: 2000000000, sunsPerSecond: 11000000, type: 'plant', size: 'planetary' },
    { id: 102, name: 'Cristal de Júpiter', emoji: '✨', description: 'Un gigante de gas y soles.', cost: 10000000000, sunsPerSecond: 55000000, type: 'plant', size: 'planetary' },
    { id: 103, name: 'Anillos de Saturno', emoji: '🪐', description: 'Giran generando una fortuna.', cost: 50000000000, sunsPerSecond: 260000000, type: 'plant', size: 'planetary' },
    { id: 104, name: 'Sol en Miniatura', emoji: '☀️', description: 'El poder de una estrella en tu jardín.', cost: 250000000000, sunsPerSecond: 1200000000, type: 'plant', size: 'planetary' },
    
    // --- Xenoflora (Requires Teleporter) ---
    { id: 200, name: 'Espiga de Cristal', emoji: '💎', description: 'Crece en mundos alienígenas.', cost: 2000000000000, sunsPerSecond: 9000000000, type: 'plant', size: 'lg', requiresVip: true },
    { id: 201, name: 'Loto de Polvo Estelar', emoji: '🌌', description: 'Contiene una galaxia.', cost: 10000000000000, sunsPerSecond: 48000000000, type: 'plant', size: 'xl', requiresVip: true },
    
    // --- Animales Ayudantes (Growth Boost) ---
    { id: 500, name: 'Mariquita', emoji: '🐞', description: 'Acelera la recarga de agua.', cost: 2000, sunsPerSecond: 0, growthBoost: 0.05, type: 'animal', size: 'sm' },
    { id: 501, name: 'Mariposa', emoji: '🦋', description: 'Poliniza, acelerando la recarga.', cost: 5000, sunsPerSecond: 0, growthBoost: 0.1, type: 'animal', size: 'sm' },
    { id: 502, name: 'Abeja', emoji: '🐝', description: 'Muy trabajadora, recarga agua más rápido.', cost: 15000, sunsPerSecond: 0, growthBoost: 0.2, type: 'animal', size: 'sm' },
    { id: 503, name: 'Perro', emoji: '🐶', description: 'Cava pozos, ¡más agua!', cost: 100000, sunsPerSecond: 0, growthBoost: 0.5, type: 'animal', size: 'md' },
    { id: 504, name: 'Gato', emoji: '🐱', description: 'Supervisa la humedad.', cost: 120000, sunsPerSecond: 0, growthBoost: 0.6, type: 'animal', size: 'md' },
    { id: 505, name: 'Conejo', emoji: '🐇', description: 'Encuentra fuentes subterráneas.', cost: 250000, sunsPerSecond: 0, growthBoost: 0.8, type: 'animal', size: 'md' },
    
    // --- Animales Productores (Suns per Second) ---
    { id: 700, name: 'Zorro', emoji: '🦊', description: 'Astuto buscador de tesoros.', cost: 600000, sunsPerSecond: 4000, type: 'animal', size: 'md' },
    { id: 701, name: 'Ciervo', emoji: '🦌', description: 'El rey del bosque.', cost: 1500000, sunsPerSecond: 10000, type: 'animal', size: 'lg' },
    { id: 702, name: 'Tigre', emoji: '🐅', description: 'Un depredador de soles.', cost: 10000000, sunsPerSecond: 65000, type: 'animal', size: 'lg' },
    { id: 703, name: 'Dragón', emoji: '🐉', description: 'Escupe fuego y soles.', cost: 500000000, sunsPerSecond: 3000000, type: 'animal', size: 'xl', requiresVip: true },
    { id: 704, name: 'Fénix', emoji: '🔥', description: 'Renace de sus cenizas generando una fortuna.', cost: 1500000000, sunsPerSecond: 8000000, type: 'animal', size: 'xl', requiresVip: true },

    // --- Animales Acuáticos ---
    { id: 800, name: 'Pez Tropical', emoji: '🐠', description: 'Necesita un estanque.', cost: 75000, sunsPerSecond: 500, type: 'animal', size: 'sm', requiresPool: true },
    { id: 801, name: 'Pato', emoji: '🦆', description: 'Le encanta el agua.', cost: 120000, sunsPerSecond: 850, type: 'animal', size: 'sm', requiresPool: true },
    { id: 802, name: 'Delfín', emoji: '🐬', description: 'Inteligente y juguetón. Requiere piscina.', cost: 5000000, sunsPerSecond: 30000, type: 'animal', size: 'md', requiresPool: true },
    { id: 803, name: 'Tiburón', emoji: '🦈', description: '¡Cuidado! Requiere piscina.', cost: 15000000, sunsPerSecond: 90000, type: 'animal', size: 'lg', requiresPool: true },
];
