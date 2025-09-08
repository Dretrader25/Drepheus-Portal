import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  matrixVertexShader, 
  matrixFragmentShader,
  particleVertexShader,
  particleFragmentShader,
  backgroundVertexShader,
  backgroundFragmentShader
} from '../shaders/matrixShaders';

// Create custom shader materials
const MatrixMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    primaryColor: new THREE.Color('#00ff00'),
    secondaryColor: new THREE.Color('#003300'),
    brightColor: new THREE.Color('#66ff66'),
    glitchIntensity: 0.02,
    flickerIntensity: 0.1
  },
  matrixVertexShader,
  matrixFragmentShader
);

const ParticleMaterial = shaderMaterial(
  {
    time: 0,
    mouse: new THREE.Vector2(0.5, 0.5),
    mouseInfluence: 2.0,
    color: new THREE.Color('#00ff00')
  },
  particleVertexShader,
  particleFragmentShader
);

const BackgroundMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    primaryColor: new THREE.Color('#00ff00')
  },
  backgroundVertexShader,
  backgroundFragmentShader
);

// Extend materials to use with JSX
extend({ MatrixMaterial, ParticleMaterial, BackgroundMaterial });

// Color themes for shaders
const SHADER_THEMES = {
  green: { 
    primary: new THREE.Color('#00ff00'),
    secondary: new THREE.Color('#003300'),
    bright: new THREE.Color('#66ff66')
  },
  blue: { 
    primary: new THREE.Color('#00ffff'),
    secondary: new THREE.Color('#003333'),
    bright: new THREE.Color('#66ffff')
  },
  gold: { 
    primary: new THREE.Color('#ffd700'),
    secondary: new THREE.Color('#333300'),
    bright: new THREE.Color('#ffff66')
  },
  white: { 
    primary: new THREE.Color('#ffffff'),
    secondary: new THREE.Color('#333333'),
    bright: new THREE.Color('#ffffff')
  }
};

// Advanced Matrix Stream with shader-based rendering
function AdvancedMatrixStream({ 
  x, 
  speed, 
  length, 
  theme, 
  depth, 
  mousePosition,
  settings 
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Create geometry with custom attributes
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.5, length * 0.7);
    const count = geo.attributes.position.count;
    
    // Custom attributes for shader
    const brightness = new Float32Array(count);
    const charIndex = new Float32Array(count);
    const streamOffset = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      brightness[i] = Math.random() * (1 - i / count);
      charIndex[i] = Math.random() * 100;
      streamOffset[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
    geo.setAttribute('charIndex', new THREE.BufferAttribute(charIndex, 1));
    geo.setAttribute('streamOffset', new THREE.BufferAttribute(streamOffset, 1));
    
    return geo;
  }, [length]);
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Update time uniform
      materialRef.current.time = state.clock.elapsedTime;
      
      // Move stream
      meshRef.current.position.y -= speed;
      
      // Reset position when off screen
      if (meshRef.current.position.y < -30) {
        meshRef.current.position.y = 25;
        
        // Randomize attributes for variety
        const brightness = geometry.attributes.brightness.array;
        const charIndex = geometry.attributes.charIndex.array;
        
        for (let i = 0; i < brightness.length; i++) {
          if (Math.random() < 0.1) {
            brightness[i] = Math.random();
            charIndex[i] = Math.random() * 100;
          }
        }
        
        geometry.attributes.brightness.needsUpdate = true;
        geometry.attributes.charIndex.needsUpdate = true;
      }
      
      // Parallax effect
      const parallaxStrength = 0.02;
      const offsetX = (mousePosition.x - 0.5) * parallaxStrength * depth;
      const offsetZ = (mousePosition.y - 0.5) * parallaxStrength * depth;
      
      meshRef.current.position.x = x + offsetX;
      meshRef.current.position.z = depth + offsetZ;
      
      // Update theme colors
      const colors = SHADER_THEMES[theme];
      materialRef.current.primaryColor = colors.primary;
      materialRef.current.secondaryColor = colors.secondary;
      materialRef.current.brightColor = colors.bright;
      materialRef.current.glitchIntensity = settings.glitchIntensity;
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry} position={[x, 10, depth]}>
      <matrixMaterial ref={materialRef} transparent />
    </mesh>
  );
}

// Advanced particle system
function AdvancedParticleSystem({ theme, mousePosition, settings }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const particleCount = 100;
  
  const { positions, life, size, velocity } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const size = new Float32Array(particleCount);
    const velocity = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      life[i] = Math.random();
      size[i] = 2 + Math.random() * 3;
      
      velocity[i * 3] = (Math.random() - 0.5) * 0.02;
      velocity[i * 3 + 1] = -0.01 - Math.random() * 0.02;
      velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions, life, size, velocity };
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current && materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.mouse.x = mousePosition.x;
      materialRef.current.mouse.y = mousePosition.y;
      materialRef.current.color = SHADER_THEMES[theme].primary;
      
      // Update particle positions
      const positions = pointsRef.current.geometry.attributes.position.array;
      const lifeArray = pointsRef.current.geometry.attributes.life.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Move particles
        positions[i * 3] += velocity[i * 3];
        positions[i * 3 + 1] += velocity[i * 3 + 1];
        positions[i * 3 + 2] += velocity[i * 3 + 2];
        
        // Update life
        lifeArray[i] -= 0.01;
        
        // Reset particles
        if (lifeArray[i] <= 0 || positions[i * 3 + 1] < -25) {
          positions[i * 3] = (Math.random() - 0.5) * 50;
          positions[i * 3 + 1] = 25;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
          lifeArray[i] = 1;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.life.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          array={positions}
          count={particleCount}
          itemSize={3}
          attach="attributes-position"
        />
        <bufferAttribute
          array={life}
          count={particleCount}
          itemSize={1}
          attach="attributes-life"
        />
        <bufferAttribute
          array={size}
          count={particleCount}
          itemSize={1}
          attach="attributes-size"
        />
        <bufferAttribute
          array={velocity}
          count={particleCount}
          itemSize={3}
          attach="attributes-velocity"
        />
      </bufferGeometry>
      <particleMaterial ref={materialRef} transparent blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Animated background with shaders
function AnimatedBackground({ theme }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.primaryColor = SHADER_THEMES[theme].primary;
      materialRef.current.resolution.set(viewport.width, viewport.height);
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <backgroundMaterial ref={materialRef} />
    </mesh>
  );
}

// Main shader-based Matrix scene
function AdvancedMatrixScene({ theme, mousePosition, settings }) {
  const { viewport } = useThree();
  const streamCount = Math.floor(settings.streamDensity * 0.8); // Optimize for performance
  
  const streams = useMemo(() => {
    return Array.from({ length: streamCount }, (_, index) => ({
      x: (index / streamCount) * viewport.width - viewport.width / 2,
      speed: 0.02 + Math.random() * 0.05,
      length: 15 + Math.floor(Math.random() * 20),
      depth: -5 + Math.random() * 10,
      id: index
    }));
  }, [streamCount, viewport.width]);

  return (
    <>
      {/* Animated background */}
      <AnimatedBackground theme={theme} />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight 
        position={[0, 0, 10]} 
        intensity={0.5} 
        color={SHADER_THEMES[theme].primary} 
      />
      
      {/* Matrix streams */}
      {streams.map((stream) => (
        <AdvancedMatrixStream
          key={stream.id}
          x={stream.x}
          speed={stream.speed}
          length={stream.length}
          theme={theme}
          depth={stream.depth}
          mousePosition={mousePosition}
          settings={settings}
        />
      ))}
      
      {/* Particle system */}
      {settings.ambientParticles && (
        <AdvancedParticleSystem 
          theme={theme} 
          mousePosition={mousePosition}
          settings={settings}
        />
      )}
    </>
  );
}

// Main advanced Matrix Rain component
const AdvancedMatrixRain = ({ 
  theme = 'green',
  className = '',
  settings = {
    streamDensity: 50,
    glitchIntensity: 0.02,
    ambientParticles: true,
    motionBlur: true,
    interactive: true,
    useShaders: true
  }
}) => {
  const containerRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse tracking
  const handleMouseMove = React.useCallback((event) => {
    if (!settings.interactive) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  }, [settings.interactive]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let rafId;
    const throttledMouseMove = (event) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(event);
        rafId = null;
      });
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', throttledMouseMove);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', throttledMouseMove);
        }
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden bg-black ${className}`}
      style={{
        filter: settings.motionBlur ? 'blur(0.3px)' : 'none'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false, // Disable for performance
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <AdvancedMatrixScene 
          theme={theme} 
          mousePosition={mousePosition}
          settings={settings}
        />
      </Canvas>
      
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          zIndex: 2
        }}
      />
    </div>
  );
};

export default AdvancedMatrixRain;
