import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Matrix characters including Japanese katakana, Latin letters, and numbers
const MATRIX_CHARS = [
  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
  'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ', 'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ',
  'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ',
  'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ', 'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ',
  'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ｦ', 'ﾝ',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
  '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\',
  ';', ':', '"', "'", '<', '>', ',', '.', '?', '/'
];

// Generate a random matrix character
const getRandomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

// Color themes
const THEMES = {
  green: { primary: '#00ff00', secondary: '#003300', bright: '#66ff66' },
  blue: { primary: '#00ffff', secondary: '#003333', bright: '#66ffff' },
  gold: { primary: '#ffd700', secondary: '#333300', bright: '#ffff66' },
  white: { primary: '#ffffff', secondary: '#333333', bright: '#ffffff' }
};

// Simple character component using Text
function MatrixChar({ position, char, brightness, theme, glitchIntensity }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const color = useMemo(() => {
    const colors = THEMES[theme];
    if (brightness > 0.8) return colors.bright;
    if (brightness > 0.5) return colors.primary;
    return colors.secondary;
  }, [brightness, theme]);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Apply glitch effect
      if (Math.random() < glitchIntensity) {
        const glitchOffset = (Math.random() - 0.5) * 0.1;
        meshRef.current.position.x = position[0] + glitchOffset;
        meshRef.current.position.y = position[1] + glitchOffset;
      } else {
        meshRef.current.position.x = position[0];
        meshRef.current.position.y = position[1];
      }
      
      // Flickering effect
      const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
      materialRef.current.opacity = brightness * flicker;
    }
  });

  return (
    <mesh ref={meshRef} position={[...position, 0]}>
      <planeGeometry args={[0.4, 0.6]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={brightness}
      />
    </mesh>
  );
}

// Single rain stream component
function RainStream({ 
  x, 
  speed, 
  length, 
  theme, 
  depth, 
  mousePosition,
  glitchIntensity 
}) {
  const groupRef = useRef();
  const [chars, setChars] = useState([]);
  const [positions, setPositions] = useState([]);
  
  // Initialize stream
  useEffect(() => {
    const streamChars = Array.from({ length }, () => ({
      char: getRandomChar(),
      brightness: Math.random(),
      id: Math.random()
    }));
    setChars(streamChars);
    
    const streamPositions = streamChars.map((_, index) => [
      x,
      20 - index * 0.8,
      depth
    ]);
    setPositions(streamPositions);
  }, [x, length, depth]);
  
  // Animation frame
  useFrame((state) => {
    if (groupRef.current) {
      // Move stream down
      groupRef.current.position.y -= speed;
      
      // Reset when off screen
      if (groupRef.current.position.y < -30) {
        groupRef.current.position.y = 25;
        
        // Regenerate characters for variety
        if (Math.random() < 0.2) {
          setChars(chars.map(char => ({
            ...char,
            char: Math.random() < 0.5 ? getRandomChar() : char.char,
            brightness: Math.random()
          })));
        }
      }
      
      // Parallax effect based on mouse position
      if (mousePosition) {
        const parallaxStrength = 0.01;
        const offsetX = (mousePosition.x - 0.5) * parallaxStrength * depth;
        const offsetZ = (mousePosition.y - 0.5) * parallaxStrength * depth;
        
        groupRef.current.position.x = x + offsetX;
        groupRef.current.position.z = depth + offsetZ;
        
        // Apply subtle rotation based on mouse movement
        const rotationStrength = 0.005;
        groupRef.current.rotation.z = (mousePosition.x - 0.5) * rotationStrength;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {chars.map((charData, index) => (
        <MatrixChar
          key={`${charData.id}-${index}`}
          position={[0, -index * 0.8, 0]}
          char={charData.char}
          brightness={charData.brightness * (1 - index / length)}
          theme={theme}
          glitchIntensity={glitchIntensity}
        />
      ))}
    </group>
  );
}

// Particle system for ambient effects
function AmbientParticles({ theme, mousePosition }) {
  const pointsRef = useRef();
  const particleCount = 30;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color = new THREE.Color(THEMES[theme].primary);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [theme]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.01;
        
        if (positions[i * 3 + 1] < -20) {
          positions[i * 3 + 1] = 20;
          positions[i * 3] = (Math.random() - 0.5) * 40;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        
        // Mouse interaction
        if (mousePosition) {
          const dx = positions[i * 3] - mousePosition.x * 20;
          const dy = positions[i * 3 + 1] - mousePosition.y * 20;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 3) {
            positions[i * 3] += (dx / distance) * 0.05;
            positions[i * 3 + 1] += (dy / distance) * 0.05;
          }
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          array={particles.positions}
          count={particleCount}
          itemSize={3}
          attach="attributes-position"
        />
        <bufferAttribute
          array={particles.colors}
          count={particleCount}
          itemSize={3}
          attach="attributes-color"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Three.js scene component
function MatrixScene({ theme, mousePosition, settings }) {
  const { viewport } = useThree();
  const streamCount = Math.min(settings.streamDensity, 60); // Cap for performance
  
  const streams = useMemo(() => {
    return Array.from({ length: streamCount }, (_, index) => ({
      x: (index / streamCount) * viewport.width - viewport.width / 2,
      speed: 0.08 + Math.random() * 0.02,
,
      length: 8 + Math.floor(Math.random() * 5),

      depth: -3 + Math.random() * 6,
      id: index
    }));
  }, [streamCount, viewport.width]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 8]} intensity={0.3} color={THEMES[theme].primary} />
      
      {streams.map((stream) => (
        <RainStream
          key={stream.id}
          x={stream.x}
          speed={stream.speed}
          length={stream.length}
          theme={theme}
          depth={stream.depth}
          mousePosition={mousePosition}
          glitchIntensity={settings.glitchIntensity}
        />
      ))}
      
      {settings.ambientParticles && (
        <AmbientParticles theme={theme} mousePosition={mousePosition} />
      )}
    </>
  );
}

// Main MatrixRain component
const SimpleMatrixRain = ({ 
  theme = 'green',
  className = '',
  settings = {
    streamDensity: 40,
    glitchIntensity: 0.02,
    ambientParticles: true,
    motionBlur: true,
    interactive: true
  }
}) => {
  const containerRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse tracking for parallax effect
  const handleMouseMove = useCallback((event) => {
    if (!settings.interactive) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  }, [settings.interactive]);

  // Initialize component
  useEffect(() => {
    setIsLoaded(true);
    
    // GSAP entrance animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Performance optimization: throttle mouse events
  useEffect(() => {
    let timeoutId;
    const throttledMouseMove = (event) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleMouseMove(event);
        timeoutId = null;
      }, 16); // ~60fps
    };

    const currentContainer = containerRef.current;
    if (currentContainer && settings.interactive) {
      currentContainer.addEventListener('mousemove', throttledMouseMove);
      return () => {
        if (currentContainer) {
          currentContainer.removeEventListener('mousemove', throttledMouseMove);
        }
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [handleMouseMove, settings.interactive]);

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden bg-black ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1.5 }}
      style={{
        background: 'radial-gradient(ellipse at center, #000000 0%, #000000 100%)',
        filter: settings.motionBlur ? 'blur(0.3px)' : 'none'
      }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-30" />
      
      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, 12], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        dpr={[1, 2]} // Responsive pixel ratio for performance
        performance={{ min: 0.5 }} // Performance threshold
        gl={{ 
          antialias: false, // Disable for performance
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <MatrixScene 
          theme={theme} 
          mousePosition={mousePosition}
          settings={settings}
        />
      </Canvas>
      
      {/* Additional CSS overlay effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(45deg, transparent 0%, ${THEMES[theme].primary}05 50%, transparent 100%)`,
          zIndex: 2
        }}
      />
      
      {/* Scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          zIndex: 3
        }}
      />
    </motion.div>
  );
};

export default SimpleMatrixRain;
