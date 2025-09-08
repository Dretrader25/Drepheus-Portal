import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MatrixVideoBackground = ({ 
  theme = 'green',
  className = '',
  settings = {
    opacity: 0.8,
    blur: 0,
    interactive: true,
    useYouTube: true // Set to false when local video is available
  }
}) => {
  const videoRef = useRef();
  const containerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [videoError, setVideoError] = useState(false);

  // Color overlays for different themes
  const themeOverlays = {
    green: 'rgba(0, 255, 0, 0.15)',
    blue: 'rgba(0, 255, 255, 0.15)',
    gold: 'rgba(255, 215, 0, 0.15)',
    white: 'rgba(255, 255, 255, 0.15)'
  };

  // Handle mouse movement for parallax effect
  const handleMouseMove = (event) => {
    if (!settings.interactive) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    if (settings.useYouTube) {
      // For YouTube embed, just mark as loaded
      setTimeout(() => setIsLoaded(true), 1000);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
        setVideoError(true);
      });
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(console.error);
    };

    const handleError = () => {
      console.warn('Video failed to load, falling back to YouTube embed');
      setVideoError(true);
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Ensure video plays on load
    if (video.readyState >= 3) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [settings.useYouTube]);

  useEffect(() => {
    if (settings.interactive && containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, [settings.interactive]);

  const parallaxTransform = settings.interactive ? 
    `scale(${1.02 + (mousePosition.x - 0.5) * 0.01}) translateX(${(mousePosition.x - 0.5) * 5}px) translateY(${(mousePosition.y - 0.5) * 5}px)` : 
    'scale(1.02)';

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 2 }}
      style={{
        background: '#000000'
      }}
    >
      {/* Video Background - YouTube Embed or Local Video */}
      {(settings.useYouTube || videoError) ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          style={{
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
            opacity: settings.opacity,
            filter: `blur(${settings.blur}px)`,
            transform: parallaxTransform,
            pointerEvents: 'none'
          }}
          src="https://www.youtube.com/embed/PYlF8HgM90Y?autoplay=1&mute=1&loop=1&playlist=PYlF8HgM90Y&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&start=0&end=0"
          title="Matrix Rain Background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: settings.opacity,
            filter: `blur(${settings.blur}px)`,
            transform: parallaxTransform
          }}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/matrix-rain.mp4" type="video/mp4" />
          <source src="/videos/matrix-rain.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Theme Color Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: themeOverlays[theme],
          mixBlendMode: 'multiply',
          zIndex: 1
        }}
      />

      {/* Matrix-style glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, ${themeOverlays[theme]} 0%, transparent 60%),
            radial-gradient(circle at 70% 80%, ${themeOverlays[theme]} 0%, transparent 60%),
            linear-gradient(180deg, transparent 0%, ${themeOverlays[theme]} 50%, transparent 100%)
          `,
          mixBlendMode: 'screen',
          zIndex: 2
        }}
      />

      {/* Scanlines for authentic CRT effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background: `repeating-linear-gradient(
            0deg, 
            transparent, 
            transparent 1px, 
            rgba(0,255,0,0.03) 1px, 
            rgba(0,255,0,0.03) 3px
          )`,
          zIndex: 3
        }}
      />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `
            repeating-conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            ${themeOverlays[theme]} 1deg, 
            transparent 2deg)
          `,
          zIndex: 4
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-green-400 font-mono text-xl">
            Loading Matrix...
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MatrixVideoBackground;
