import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

// Matrix characters
const MATRIX_CHARS = [
  'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
  'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

const getRandomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

// HTML-based Matrix rain (guaranteed to work)
const HTMLMatrixRain = ({ theme = 'green' }) => {
  const containerRef = useRef();
  const [streams, setStreams] = useState([]);

  const colors = {
    green: { primary: '#00ff00', secondary: '#008800', dark: '#004400' },
    blue: { primary: '#00ffff', secondary: '#0088aa', dark: '#004455' },
    gold: { primary: '#ffd700', secondary: '#cc8800', dark: '#664400' },
    white: { primary: '#ffffff', secondary: '#cccccc', dark: '#666666' }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const streamCount = Math.floor(containerWidth / 20);
    
    const newStreams = [];
    
    for (let i = 0; i < streamCount; i++) {
      const stream = {
        id: i,
        x: i * 20,
        chars: [],
        speeds: []
      };
      
      const streamLength = 15 + Math.floor(Math.random() * 10);
      for (let j = 0; j < streamLength; j++) {
        stream.chars.push(getRandomChar());
        stream.speeds.push(1 + Math.random() * 2);
      }
      
      newStreams.push(stream);
    }
    
    setStreams(newStreams);
  }, []);

  useEffect(() => {
    if (streams.length === 0) return;

    const animateStreams = () => {
      streams.forEach((stream) => {
        stream.chars.forEach((char, index) => {
          const element = document.getElementById(`char-${stream.id}-${index}`);
          if (element) {
            const currentTop = parseInt(element.style.top) || -50;
            const newTop = currentTop + stream.speeds[index];
            
            if (newTop > window.innerHeight + 50) {
              element.style.top = `-${Math.random() * 200 + 50}px`;
              element.textContent = getRandomChar();
            } else {
              element.style.top = `${newTop}px`;
            }
            
            // Color based on position in stream
            const opacity = Math.max(0.1, 1 - (index / stream.chars.length));
            if (index === 0) {
              element.style.color = colors[theme].primary;
              element.style.textShadow = `0 0 10px ${colors[theme].primary}`;
            } else if (index < 3) {
              element.style.color = colors[theme].secondary;
              element.style.textShadow = `0 0 5px ${colors[theme].secondary}`;
            } else {
              element.style.color = colors[theme].dark;
              element.style.textShadow = 'none';
            }
            element.style.opacity = opacity;
          }
        });
      });
      
      requestAnimationFrame(animateStreams);
    };
    
    animateStreams();
  }, [streams, theme, colors]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'radial-gradient(ellipse at center, #000000 0%, #000000 100%)',
        fontFamily: 'monospace'
      }}
    >
      {streams.map((stream) =>
        stream.chars.map((char, index) => (
          <div
            key={`${stream.id}-${index}`}
            id={`char-${stream.id}-${index}`}
            className="absolute font-mono text-lg font-bold pointer-events-none select-none"
            style={{
              left: `${stream.x}px`,
              top: `-${index * 20 + Math.random() * 200}px`,
              color: colors[theme].primary,
              fontSize: '18px',
              lineHeight: '20px',
              textShadow: `0 0 10px ${colors[theme].primary}`,
              zIndex: 1
            }}
          >
            {char}
          </div>
        ))
      )}
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
          zIndex: 2
        }}
      />
    </div>
  );
};

// Simple 3D backup with cubes (in case Text fails)
const Simple3DRain = ({ theme }) => {
  const groupRef = useRef();
  const meshRefs = useRef([]);
  
  const colors = {
    green: '#00ff00',
    blue: '#00ffff', 
    gold: '#ffd700',
    white: '#ffffff'
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, index) => {
        mesh.position.y -= 0.05;
        if (mesh.position.y < -10) {
          mesh.position.y = 10;
          mesh.position.x = (Math.random() - 0.5) * 20;
        }
        
        // Rotate for visual interest
        mesh.rotation.x += 0.01;
        mesh.rotation.z += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }, (_, i) => (
        <mesh
          key={i}
          position={[(Math.random() - 0.5) * 20, Math.random() * 20, (Math.random() - 0.5) * 10]}
          ref={el => meshRefs.current[i] = el}
        >
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshBasicMaterial color={colors[theme]} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Main component
const WorkingMatrixRain = ({ 
  theme = 'green',
  className = '',
  settings = {
    use3D: false,
    interactive: true
  }
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMouseMove = useCallback((event) => {
    if (!settings.interactive) return;
    
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    setMousePosition({ x, y });
  }, [settings.interactive]);

  useEffect(() => {
    setIsLoaded(true);
    
    if (settings.interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove, settings.interactive]);

  return (
    <motion.div
      className={`fixed inset-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {settings.use3D ? (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.2} />
          <Simple3DRain theme={theme} />
        </Canvas>
      ) : (
        <HTMLMatrixRain theme={theme} />
      )}
    </motion.div>
  );
};

export default WorkingMatrixRain;
