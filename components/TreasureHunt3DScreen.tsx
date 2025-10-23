import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { PIXEL_FOREST_WORDS } from '../constants';
import { speak, playCorrectSound, playJumpSound } from '../utils/audio';

// --- Game Config ---
const WORLD_SIZE = 50;
const MOVEMENT_SPEED = 5.0;
const JUMP_VELOCITY = 7.0;
const GRAVITY = -20.0;
const PLAYER_HEIGHT = 1.8;
const PLAYER_RADIUS = 0.5;

// --- Texture Generation ---
const createTexture = (draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    draw(context, canvas);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
};

const grassTexture = createTexture((ctx, canvas) => {
    ctx.fillStyle = '#348C31';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 10);
    }
});
grassTexture.repeat.set(WORLD_SIZE / 4, WORLD_SIZE / 4);

const brickTexture = createTexture((ctx, canvas) => {
    ctx.fillStyle = '#B22222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    for (let i = 0; i < canvas.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
        const offset = (i / 32) % 2 === 0 ? 0 : 64;
        for (let j = offset; j < canvas.width; j += 128) {
            ctx.beginPath();
            ctx.moveTo(j, i);
            ctx.lineTo(j, i + 32);
            ctx.stroke();
        }
    }
});
brickTexture.repeat.set(2, 2);

// --- Component ---
const TreasureHunt3DScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const player = useRef({
        velocity: new THREE.Vector3(),
        canJump: true,
        box: new THREE.Box3(),
    });
    
    const [word, setWord] = useState('');
    const [foundLetters, setFoundLetters] = useState<string[]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
    const [hint, setHint] = useState('');
    const [isPaused, setIsPaused] = useState(true);

    const collidableObjects = useRef<THREE.Group[]>([]);

    const setupNewGame = useCallback((scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        // Clear previous game objects
        scene.children.filter(obj => obj.userData.isGameObject).forEach(obj => scene.remove(obj));
        collidableObjects.current = [];

        const newWord = PIXEL_FOREST_WORDS[Math.floor(Math.random() * PIXEL_FOREST_WORDS.length)];
        setWord(newWord);
        setFoundLetters([]);
        setGameState('playing');
        
        camera.position.set(WORLD_SIZE / 2, PLAYER_HEIGHT, WORLD_SIZE / 2);
        
        // Add houses (explorable) and trees
        for (let i = 0; i < 15; i++) {
            const house = createHouse();
            house.position.set(Math.random() * (WORLD_SIZE - 6) + 3, 0, Math.random() * (WORLD_SIZE - 6) + 3);
            house.userData = { isGameObject: true, isCollidable: true };
            scene.add(house);
            collidableObjects.current.push(house);
        }
        for (let i = 0; i < 40; i++) {
            const tree = createTree();
            tree.position.set(Math.random() * WORLD_SIZE, 0, Math.random() * WORLD_SIZE);
            tree.userData = { isGameObject: true, isCollidable: true };
            scene.add(tree);
            collidableObjects.current.push(tree);
        }

        // Add letters
        newWord.split('').forEach(char => {
            const letterSprite = createLetterSprite(char);
            letterSprite.position.set(Math.random() * WORLD_SIZE, 1.5, Math.random() * WORLD_SIZE);
            letterSprite.userData = { isGameObject: true, isLetter: true, char: char };
            scene.add(letterSprite);
        });

        const firstLetter = newWord[0];
        setHint(`Busca la letra '${firstLetter}'`);
        speak(`¡A la aventura! Busca la letra '${firstLetter}'`);
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 0, 40);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);
        
        const ground = new THREE.Mesh( new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE), new THREE.MeshStandardMaterial({ map: grassTexture }) );
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        setupNewGame(scene, camera);

        const onKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.code] = true; };
        const onKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.code] = false; };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        const lockPointerOnClick = () => renderer.domElement.requestPointerLock();
        renderer.domElement.addEventListener('click', lockPointerOnClick);

        const onPointerLockChange = () => { setIsPaused(document.pointerLockElement !== renderer.domElement); };
        document.addEventListener('pointerlockchange', onPointerLockChange);

        const onMouseMove = (e: MouseEvent) => {
            if (document.pointerLockElement === renderer.domElement) {
                camera.rotation.y -= e.movementX * 0.002;
                camera.rotation.x -= e.movementY * 0.002;
                camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
            }
        };
        document.addEventListener('mousemove', onMouseMove);

        const clock = new THREE.Clock();
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            if (!isPaused && gameState === 'playing') {
                updatePlayer(delta, camera);
            }
            renderer.render(scene, camera);
        };
        animate();
        
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            renderer.domElement.removeEventListener('click', lockPointerOnClick);
            document.removeEventListener('pointerlockchange', onPointerLockChange);
            document.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const updatePlayer = (delta: number, camera: THREE.Camera) => {
        const speed = MOVEMENT_SPEED;
        const playerVelocity = player.current.velocity;
        
        playerVelocity.y += GRAVITY * delta;
        camera.position.y += playerVelocity.y * delta;
        
        if (camera.position.y < PLAYER_HEIGHT) {
            playerVelocity.y = 0;
            camera.position.y = PLAYER_HEIGHT;
            player.current.canJump = true;
        }

        const moveDirection = new THREE.Vector3(
            Number(keysPressed.current['KeyD']) - Number(keysPressed.current['KeyA']), 0,
            Number(keysPressed.current['KeyW']) - Number(keysPressed.current['KeyS'])
        ).normalize();
        
        if (keysPressed.current['Space'] && player.current.canJump) {
            playJumpSound();
            playerVelocity.y = JUMP_VELOCITY;
            player.current.canJump = false;
        }

        const movement = new THREE.Vector3();
        if (moveDirection.length() > 0) {
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            cameraDirection.normalize();
            
            const right = new THREE.Vector3().crossVectors(camera.up, cameraDirection).normalize();
            movement.add(cameraDirection.multiplyScalar(moveDirection.z * speed * delta));
            movement.add(right.multiplyScalar(moveDirection.x * speed * delta));
        }
        
        // Collision Detection
        const tempPlayerBox = player.current.box.clone().translate(camera.position);

        for(const obj of collidableObjects.current) {
            obj.children.forEach(child => {
                 const childBox = new THREE.Box3().setFromObject(child);
                 if (tempPlayerBox.clone().translate(new THREE.Vector3(movement.x, 0, 0)).intersectsBox(childBox)) movement.x = 0;
                 if (tempPlayerBox.clone().translate(new THREE.Vector3(0, 0, movement.z)).intersectsBox(childBox)) movement.z = 0;
            });
        }
        
        camera.position.add(movement);
        
        // World boundaries
        camera.position.x = Math.max(PLAYER_RADIUS, Math.min(WORLD_SIZE - PLAYER_RADIUS, camera.position.x));
        camera.position.z = Math.max(PLAYER_RADIUS, Math.min(WORLD_SIZE - PLAYER_RADIUS, camera.position.z));

        // Letter collection logic...
        const scene = camera.parent as THREE.Scene;
        if (scene) {
            const nextLetterChar = word[foundLetters.length];
            const letter = scene.children.find(c => c.userData.char === nextLetterChar);
            if (letter && camera.position.distanceTo(letter.position) < 1.5) {
                scene.remove(letter);
                playCorrectSound();
                const newFound = [...foundLetters, nextLetterChar];
                setFoundLetters(newFound);
                
                if (newFound.length === word.length) {
                    setGameState('won');
                    speak(`¡Felicidades! Encontraste la palabra ${word}`);
                } else {
                    const hintText = `¡Bien! Ahora busca la letra '${word[newFound.length]}'`;
                    setHint(hintText);
                    speak(hintText);
                }
            }
        }
    };
    
    // Hacky restart
    const handleRestart = () => { window.location.reload(); }

    return (
        <div className="w-screen h-screen relative cursor-pointer bg-black">
            <div ref={mountRef} className="w-full h-full" />
            
             {(isPaused || gameState !== 'playing') && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                    <div className="bg-white p-8 rounded-lg text-center shadow-lg max-w-sm">
                        {gameState === 'won' ? (
                             <>
                                <h2 className="text-3xl font-bold text-green-600 mb-4">¡Has Ganado!</h2>
                                <p className="text-lg mb-6">La palabra era: <span className="font-bold">{word}</span></p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-blue-600 mb-4">Juego en Pausa</h2>
                                <p className="text-lg mb-6">Haz clic en la pantalla para reanudar.</p>
                            </>
                        )}
                        <div className="flex gap-4 justify-center">
                           <button onClick={handleRestart} className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600">Jugar de Nuevo</button>
                           <button onClick={onExit} className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Salir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HUD */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-center" style={{textShadow: '2px 2px 4px #000'}}>
                 <p className="text-4xl tracking-widest">{word.split('').map((char, i) => <span key={i} className={i < foundLetters.length ? 'text-green-400' : 'text-gray-400'}>{foundLetters[i] || '_'}</span>)}</p>
                 <p className="text-yellow-300 text-xl mt-2">{hint}</p>
            </div>
            {!isPaused && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl opacity-70">+</div>}
        </div>
    );
};

function createLetterSprite(letter: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillStyle = 'rgba(255, 255, 0, 0.2)';
    context.beginPath(); context.arc(64, 64, 60, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#FFFF00'; context.lineWidth=8; context.stroke();
    context.font = 'bold 80px Fredoka, sans-serif';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = "black"; context.shadowBlur = 15;
    context.fillText(letter, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, sizeAttenuation: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.5, 1.5, 1.5);
    return sprite;
}

function createHouse(): THREE.Group {
    const house = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({ map: brickTexture });
    const wallHeight = 4;
    const wallWidth = 5;
    const wallDepth = 6;
    
    const walls = [
        { size: [wallWidth, wallHeight, 0.2], pos: [0, wallHeight / 2, wallDepth / 2] }, // Back
        { size: [wallWidth, wallHeight, 0.2], pos: [0, wallHeight / 2, -wallDepth / 2] }, // Front (with door hole)
        { size: [wallDepth, wallHeight, 0.2], pos: [wallWidth / 2, wallHeight / 2, 0], rotY: Math.PI / 2 }, // Right
        { size: [wallDepth, wallHeight, 0.2], pos: [-wallWidth / 2, wallHeight / 2, 0], rotY: Math.PI / 2 } // Left
    ];
    
    walls.forEach(w => {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]), wallMaterial);
        wall.position.set(w.pos[0], w.pos[1], w.pos[2]);
        if(w.rotY) wall.rotation.y = w.rotY;
        house.add(wall);
    });

    // Remove the front wall and add two smaller walls to make a door
    house.children.splice(1,1);
    const leftDoorWall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth/2-0.5, wallHeight, 0.2), wallMaterial);
    leftDoorWall.position.set(-wallWidth/4-0.25, wallHeight/2, -wallDepth/2);
    house.add(leftDoorWall);
    const rightDoorWall = new THREE.Mesh(new THREE.BoxGeometry(wallWidth/2-0.5, wallHeight, 0.2), wallMaterial);
    rightDoorWall.position.set(wallWidth/4+0.25, wallHeight/2, -wallDepth/2);
    house.add(rightDoorWall);


    return house;
}

function createTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0x654321 })
    );
    trunk.position.y = 2;
    tree.add(trunk);
    
    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );
    leaves.position.y = 5;
    tree.add(leaves);
    return tree;
}

export default TreasureHunt3DScreen;
