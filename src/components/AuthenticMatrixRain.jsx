import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

// Authentic Matrix characters - mostly Japanese katakana
const MATRIX_CHARS = [
  // Japanese Katakana (primary Matrix characters)
  'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
  'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
  // Half-width katakana for variety
  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
  'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ', 'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ',
  // Numbers and some Latin letters
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  // Special symbols
  ':', '・', '¦', '|', '∷', '¬', '∫', '≡', '≈', '≠',
  'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ'
];

// Generate a random matrix character
const getRandomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

// Color themes matching the Matrix aesthetic
const THEMES = {
  green: { 
    primary: '#00ff00', 
    secondary: '#008800', 
    dark: '#004400',
    bright: '#66ff66',
    trail: '#003300'
  },
  blue: { 
    primary: '#00ffff', 
    secondary: '#0088aa', 
    dark: '#004455',
    bright: '#66ffff',
    trail: '#003333'
  },
  gold: { 
    primary: '#ffd700', 
    secondary: '#cc8800', 
    dark: '#664400',
    bright: '#ffff66',
    trail: '#333300'
  },
  white: { 
    primary: '#ffffff', 
    secondary: '#cccccc', 
    dark: '#666666',
    bright: '#ffffff',
    trail: '#333333'
  }
};

// Individual Matrix character component with authentic text rendering
function MatrixChar({ position, char, brightness, theme, glitchIntensity, fadePosition }) {
  const textRef = useRef();
  const [currentChar, setCurrentChar] = useState(char);
  const [glitchOffset, setGlitchOffset] = useState([0, 0]);
  
  const color = useMemo(() => {
    const colors = THEMES[theme];
    // Brightest at the leading edge (fadePosition close to 0)
    if (fadePosition < 0.1) return colors.bright;
    if (fadePosition < 0.3) return colors.primary;
    if (fadePosition < 0.6) return colors.secondary;
    if (fadePosition < 0.8) return colors.dark;
    return colors.trail;
  }, [theme, fadePosition]);

  useFrame((state) => {
    if (textRef.current) {
      // Apply glitch effect
      if (Math.random() < glitchIntensity) {
        const newOffset = [
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ];
        setGlitchOffset(newOffset);
        
        // Occasionally change the character for glitch effect
        if (Math.random() < 0.3) {
          setCurrentChar(getRandomChar());
        }
      } else {
        setGlitchOffset([0, 0]);
        if (Math.random() < 0.05) {
          setCurrentChar(char);
        }
      }
      
      // Apply position with glitch offset
      textRef.current.position.set(
        position[0] + glitchOffset[0],
        position[1] + glitchOffset[1],
        position[2]
      );
      
      // Flickering effect based on fade position
      const baseOpacity = Math.max(0.1, 1 - fadePosition);
      const flicker = 0.7 + Math.sin(state.clock.elapsedTime * 12 + position[0] * 10) * 0.3;
      const finalOpacity = baseOpacity * brightness * flicker;
      
      if (textRef.current.material) {
        textRef.current.material.opacity = Math.max(0, Math.min(1, finalOpacity));
      }
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.5}
      color={color}
      font="/fonts/NotoSans-Regular.ttf" // We'll fallback to system font if not available
      anchorX="center"
      anchorY="middle"
      material-transparent={true}
      material-opacity={brightness}
    >
      {currentChar}
    </Text>
  );
}

// Single rain stream with authentic character trail effect
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
  const [streamY, setStreamY] = useState(Math.random() * 30 + 10);
  
  // Initialize stream with characters
  useEffect(() => {
    const streamChars = Array.from({ length }, (_, index) => ({
      char: getRandomChar(),
      brightness: Math.max(0.1, 1 - (index / length) * 1.2),
      fadePosition: index / length,
      id: Math.random()
    }));
    setChars(streamChars);
  }, [length]);
  
  // Animation frame
  useFrame((state) => {
    if (groupRef.current) {
      // Move stream down
      const newY = streamY - speed;
      setStreamY(newY);
      groupRef.current.position.y = newY;
      
      // Reset when off screen
      if (newY < -25) {
        setStreamY(25 + Math.random() * 10);
        
        // Regenerate some characters for variety
        if (Math.random() < 0.4) {
          setChars(prev => prev.map((char, index) => ({
            ...char,
            char: Math.random() < 0.6 ? getRandomChar() : char.char,
            brightness: Math.max(0.1, 1 - (index / length) * 1.2)
          })));
        }
      }
      
      // Parallax effect based on mouse position
      if (mousePosition) {
        const parallaxStrength = depth * 0.002;
        const offsetX = (mousePosition.x - 0.5) * parallaxStrength;
        const offsetZ = (mousePosition.y - 0.5) * parallaxStrength;
        
        groupRef.current.position.x = x + offsetX;
        groupRef.current.position.z = depth + offsetZ;
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
          brightness={charData.brightness}
          fadePosition={charData.fadePosition}
          theme={theme}
          glitchIntensity={glitchIntensity}
        />
      ))}
    </group>
  );
}

// Background scanlines and glow effects
function MatrixBackground({ theme }) {
  const bgRef = useRef();
  
  useFrame((state) => {
    if (bgRef.current) {
      // Subtle pulsing effect
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      bgRef.current.material.opacity = pulse;
    }
  });
  
  return (
    <mesh ref={bgRef} position={[0, 0, -10]} scale={[50, 50, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={THEMES[theme].trail}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Floating code fragments for ambient effect
function FloatingCode({ theme, mousePosition }) {
  const fragmentsRef = useRef();
  const fragmentCount = 8;
  
  const fragments = useMemo(() => {
    return Array.from({ length: fragmentCount }, (_, i) => ({
      text: Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => getRandomChar()).join(''),
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 8
      ],
      speed: 0.005 + Math.random() * 0.01,
      opacity: 0.1 + Math.random() * 0.2,
      id: i
    }));
  }, []);
  
  useFrame((state) => {
    fragments.forEach((fragment, index) => {
      fragment.position[1] -= fragment.speed;
      
      if (fragment.position[1] < -20) {
        fragment.position[1] = 20;
        fragment.position[0] = (Math.random() - 0.5) * 30;
        fragment.text = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => getRandomChar()).join('');
      }
      
      // Mouse interaction
      if (mousePosition) {
        const dx = fragment.position[0] - mousePosition.x * 15;
        const dy = fragment.position[1] - mousePosition.y * 15;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 4) {
          fragment.position[0] += (dx / distance) * 0.02;
          fragment.position[1] += (dy / distance) * 0.02;
        }
      }
    });
  });
  
  return (
    <group ref={fragmentsRef}>
      {fragments.map((fragment) => (
        <Text
          key={fragment.id}
          position={fragment.position}
          fontSize={0.3}
          color={THEMES[theme].secondary}
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          material-opacity={fragment.opacity}
        >
          {fragment.text}
        </Text>
      ))}
    </group>
  );
}

// Main Three.js scene component
function MatrixScene({ theme, mousePosition, settings }) {
  const { viewport } = useThree();
  const streamSpacing = 1.2;
  const streamCount = Math.floor(viewport.width / streamSpacing);
  
  const streams = useMemo(() => {
    return Array.from({ length: Math.min(streamCount, settings.streamDensity) }, (_, index) => ({
      x: (index * streamSpacing) - (streamCount * streamSpacing) / 2,
      speed: 0.015 + Math.random() * 0.025,
      length: 8 + Math.floor(Math.random() * 12),
      depth: -2 + Math.random() * 4,
      id: index
    }));
  }, [streamCount, settings.streamDensity]);

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight 
        position={[0, 10, 5]} 
        intensity={0.2} 
        color={THEMES[theme].primary}
        distance={30}
        decay={2}
      />
      
      <MatrixBackground theme={theme} />
      
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
        <FloatingCode theme={theme} mousePosition={mousePosition} />
      )}
    </>
  );
}

// Main AuthenticMatrixRain component
const AuthenticMatrixRain = ({ 
  theme = 'green',
  className = '',
  settings = {
    streamDensity: 35,
    glitchIntensity: 0.015,
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
        { opacity: 1, duration: 2, ease: 'power2.out' }
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
      className={`fixed inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 2 }}
      style={{
        background: `radial-gradient(ellipse at center, #000000 0%, #000000 70%, ${THEMES[theme].trail}15 100%)`,
        filter: settings.motionBlur ? 'blur(0.2px)' : 'none'
      }}
    >
      {/* Background matrix grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${THEMES[theme].trail}40 1px, transparent 1px),
            linear-gradient(90deg, ${THEMES[theme].trail}40 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        dpr={[1, 2]}
        performance={{ min: 0.6 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <MatrixScene 
          theme={theme} 
          mousePosition={mousePosition}
          settings={settings}
        />
      </Canvas>
      
      {/* Glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${THEMES[theme].primary}08 0%, transparent 50%)`,
          zIndex: 2
        }}
      />
      
      {/* Authentic scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg, 
            transparent, 
            transparent 1px, 
            ${THEMES[theme].primary}15 1px, 
            ${THEMES[theme].primary}15 3px
          )`,
          zIndex: 3,
          mixBlendMode: 'screen'
        }}
      />
    </motion.div>
  );
};

export default AuthenticMatrixRain;
