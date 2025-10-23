import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playNoteSound, playIncorrectSound, speak } from '../utils/audio';

// --- Game Config ---
const NOTE_SPEED = 40; // pixels per second (Reduced from 80)
const HIT_ZONE_HEIGHT = 100; // The area (in px) at the bottom where a note can be hit
const LANE_KEYS = ['D', 'F', 'J', 'K']; // Changed from Q,W,E,R
const LANE_COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24']; // cyan, indigo, pink, amber

interface Note {
  id: number;
  lane: number;
  y: number;
  isHit: boolean;
}

// A simple song pattern
const SONG_DATA = [
    { time: 1.0, lane: 0 }, { time: 1.5, lane: 1 }, { time: 2.0, lane: 2 }, { time: 2.5, lane: 3 },
    { time: 3.2, lane: 0 }, { time: 3.4, lane: 1 }, { time: 4.0, lane: 3 }, { time: 4.5, lane: 2 },
    { time: 5.0, lane: 1 }, { time: 5.0, lane: 2 }, { time: 5.8, lane: 0 }, { time: 6.0, lane: 3 },
    { time: 6.4, lane: 1 }, { time: 6.8, lane: 2 }, { time: 7.2, lane: 0 }, { time: 7.2, lane: 3 },
    { time: 8.0, lane: 1 }, { time: 8.2, lane: 2 }, { time: 8.4, lane: 1 }, { time: 8.6, lane: 2 },
    { time: 9.5, lane: 0 }, { time: 9.75, lane: 1 }, { time: 10.0, lane: 2 }, { time: 10.25, lane: 3 },
    { time: 11.0, lane: 0 }, { time: 11.0, lane: 3 }, { time: 11.8, lane: 1 }, { time: 11.8, lane: 2 },
    { time: 12.5, lane: 0 }, { time: 13.0, lane: 1 }, { time: 13.5, lane: 2 }, { time: 14.0, lane: 3 },
    { time: 14.2, lane: 2 }, { time: 14.4, lane: 1 }, { time: 14.6, lane: 0 },
].sort((a, b) => a.time - b.time);

// --- Component ---
const RhythmTypingScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [laneFlashes, setLaneFlashes] = useState([false, false, false, false]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef(0);
  const songCursorRef = useRef(0);

  const resetGame = useCallback(() => {
    setNotes([]);
    setScore(0);
    setCombo(0);
    songCursorRef.current = 0;
    setGameState('countdown');
  }, []);

  useEffect(() => {
    resetGame();
    speak("Prepárate para el ritmo. Usa las teclas D, F, J y K.");
  }, [resetGame]);

  const startGame = useCallback(() => {
    startTimeRef.current = performance.now();
    setGameState('playing');
  }, []);

  // Countdown
  useEffect(() => {
    if (gameState === 'countdown') {
        const timer = setTimeout(startGame, 3000);
        return () => clearTimeout(timer);
    }
  }, [gameState, startGame]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameAreaHeight = gameAreaRef.current?.clientHeight || 0;

    const loop = (currentTime: number) => {
      const elapsedTime = (currentTime - startTimeRef.current) / 1000;

      // Spawn new notes
      let newNotes: Note[] = [];
      while (songCursorRef.current < SONG_DATA.length && SONG_DATA[songCursorRef.current].time <= elapsedTime) {
        newNotes.push({ id: Math.random(), lane: SONG_DATA[songCursorRef.current].lane, y: 0, isHit: false });
        songCursorRef.current++;
      }
      
      setNotes(prevNotes => {
        let newCombo = combo;
        const updatedNotes = [...prevNotes, ...newNotes]
          .map(note => ({
            ...note,
            y: note.y + (NOTE_SPEED * (1 / 60)), // Approximation of delta
          }))
          .filter(note => {
            if (note.y > gameAreaHeight && !note.isHit) {
              newCombo = 0; // Missed note
              return false; // Remove note
            }
            return note.y <= gameAreaHeight + 50; // Keep it a bit longer for fade out
          });
        
        if (newCombo !== combo) setCombo(newCombo);
        return updatedNotes;
      });

      if (songCursorRef.current >= SONG_DATA.length && notes.length === 0) {
        setGameState('finished');
        speak(`¡Fin de la canción! Tu puntuación final es ${score}`);
      } else {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };
    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
        cancelAnimationFrame(gameLoopRef.current!);
    }
  }, [gameState, combo, notes.length, score]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing' || !LANE_KEYS.includes(e.key.toUpperCase())) return;

    const keyIndex = LANE_KEYS.indexOf(e.key.toUpperCase());
    const gameAreaHeight = gameAreaRef.current?.clientHeight || 0;
    const hitZoneBottom = gameAreaHeight;
    const hitZoneTop = hitZoneBottom - HIT_ZONE_HEIGHT;
    
    let hit = false;
    let newNotes = [...notes];

    for (let i = 0; i < newNotes.length; i++) {
        const note = newNotes[i];
        if (!note.isHit && note.lane === keyIndex && note.y > hitZoneTop && note.y <= hitZoneBottom) {
            note.isHit = true;
            hit = true;
            break;
        }
    }

    if (hit) {
      playNoteSound(keyIndex);
      setNotes(newNotes);
      setScore(prev => prev + 100 * (combo + 1));
      setCombo(prev => prev + 1);
    } else {
      playIncorrectSound();
      setCombo(0);
    }
    
    // Visual flash effect
    setLaneFlashes(prev => {
        const newFlashes = [...prev];
        newFlashes[keyIndex] = true;
        return newFlashes;
    });
    setTimeout(() => {
        setLaneFlashes(prev => {
            const newFlashes = [...prev];
            newFlashes[keyIndex] = false;
            return newFlashes;
        });
    }, 100);

  }, [gameState, notes, combo]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center overflow-hidden">
        
        {/* Modals */}
        {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center border-2 border-pink-500">
                    {gameState === 'countdown' && <h2 className="text-6xl font-bold text-cyan-400 animate-pulse">¡Prepárate!</h2>}
                    {gameState === 'finished' && (
                        <>
                            <h2 className="text-4xl font-bold text-green-400 mb-4">¡Canción Terminada!</h2>
                            <p className="text-2xl mb-2">Puntuación Final:</p>
                            <p className="text-5xl font-bold text-yellow-400 mb-8">{score}</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={resetGame} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition">Jugar de Nuevo</button>
                                <button onClick={onExit} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition">Salir</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}

        {/* HUD */}
        <div className="w-full max-w-lg mx-auto flex justify-between p-4 text-2xl" style={{ textShadow: '0 0 10px #fff' }}>
            <div>SCORE: <span className="font-bold text-yellow-300">{score}</span></div>
            <div>COMBO: <span className="font-bold text-pink-400">{combo}x</span></div>
        </div>

        {/* Game Area */}
        <div ref={gameAreaRef} className="relative w-full max-w-lg h-full bg-black/30 border-x-2 border-cyan-400/50">
            {/* Lanes */}
            <div className="absolute inset-0 flex justify-around">
                {LANE_KEYS.map((key, i) => (
                    <div key={key} className="w-1/4 h-full border-r-2 border-gray-700/50 last:border-r-0 relative">
                        {laneFlashes[i] && <div className="absolute inset-0 bg-white/20 animate-ping-short"></div>}
                    </div>
                ))}
            </div>

            {/* Notes */}
            {notes.map(note => (
                <div 
                    key={note.id} 
                    className={`absolute w-1/4 h-8 rounded-lg transition-opacity duration-200 ${note.isHit ? 'opacity-0 scale-150' : 'opacity-100'}`}
                    style={{ 
                        left: `${note.lane * 25}%`, 
                        top: `${note.y}px`, 
                        transform: 'translateY(-100%)',
                        backgroundColor: LANE_COLORS[note.lane],
                        boxShadow: `0 0 15px ${LANE_COLORS[note.lane]}`
                    }}
                />
            ))}

            {/* Hit Zone */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" style={{boxShadow: '0 0 20px #fff'}}></div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center" style={{height: `${HIT_ZONE_HEIGHT}px`}}>
                {LANE_KEYS.map((key, i) => (
                    <div key={key} className="w-1/4 h-full flex items-center justify-center">
                        <div 
                            className="w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-all"
                            style={{ 
                                borderColor: LANE_COLORS[i], 
                                color: LANE_COLORS[i],
                                boxShadow: laneFlashes[i] ? `0 0 20px ${LANE_COLORS[i]}` : 'none',
                                transform: laneFlashes[i] ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            {key}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default RhythmTypingScreen;