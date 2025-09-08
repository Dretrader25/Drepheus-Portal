import React, { useEffect, useRef } from 'react';

const MatrixLanding = ({ onEnter }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const squareSize = 16; // Smaller size for more density
    const ctxt = canvas.getContext('2d');
    ctxt.font = `${squareSize}px monospace`;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columnCount = Math.round(canvas.width / squareSize);
    const lettersPosition = Array(columnCount).fill(1);

    const word = "Drepheus";
    const wlength = word.length;

    // Word coordinate system
    const x0 = Math.floor(((canvas.width - wlength * squareSize) / 2) / squareSize);
    const x1 = Math.floor(x0 + wlength - 1);
    const y0 = Math.floor(canvas.height / 2 / squareSize);

    const filledCharacters = Array(wlength).fill(false);
    const letterGlow = Array(wlength).fill(0); // Track glow intensity for each letter
    let filled = 0;
    let frameCount = 0;

    const reset = () => {
      filledCharacters.fill(false);
      letterGlow.fill(0);
      filled = 0;
      lettersPosition.fill(1);
    };

    const drawRain = () => {
      frameCount++;
      
      // Only update every 4 frames to slow down animation
      if (frameCount % 4 !== 0) {
        return;
      }

      if (filled === columnCount) {
        reset();
      }

      ctxt.fillStyle = "rgba(0,0,0, 0.05)"; // Slower fade for more density
      ctxt.fillRect(0, 0, canvas.width, canvas.height);
      ctxt.fillStyle = "#39ff14";

      // Update glow effects for each letter
      letterGlow.forEach((glow, i) => {
        if (filledCharacters[i]) {
          // Randomly trigger glow
          if (Math.random() < 0.02) { // 2% chance per frame to start glowing
            letterGlow[i] = 1.0;
          }
          // Fade glow over time
          if (letterGlow[i] > 0) {
            letterGlow[i] -= 0.03; // Fade speed
            if (letterGlow[i] < 0) letterGlow[i] = 0;
          }
        }
      });

      // render filled characters with glow effects
      filledCharacters.forEach((f, i) => {
        if (f) {
          const glowIntensity = letterGlow[i];
          const baseGlow = 10;
          const extraGlow = glowIntensity * 40; // Extra glow when active
          
          // Set shadow for glow effect
          ctxt.shadowColor = "#39ff14";
          ctxt.shadowBlur = baseGlow + extraGlow;
          ctxt.fillStyle = glowIntensity > 0 ? "#ffffff" : "#39ff14"; // White when glowing, green normally
          
          ctxt.fillText(word[i], (x0 + i) * squareSize, y0 * squareSize);
          
          // Reset shadow
          ctxt.shadowBlur = 0;
          ctxt.fillStyle = "#39ff14";
        }
      });

      // Render Randomness
      lettersPosition.forEach((y, i) => {
        if (y === null) {
          return;
        }

        const px = i * squareSize;
        const py = y * squareSize;
        if (x0 <= i && i <= x1 && y == y0 && Math.round(Math.random()) == 0) { // Much faster reveal (was 1.5, now 1)
          lettersPosition[i] = null;
          filledCharacters[i - x0] = true;
          filled++;
        } else {
          // More dense character selection
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
          const RandChar = chars[Math.floor(Math.random() * chars.length)];
          ctxt.fillText(RandChar, px, py);
          lettersPosition[i]++;
          if (py + squareSize >= canvas.height) {
            if (filled >= wlength) {
              lettersPosition[i] = null;
              filled++;
            } else {
              lettersPosition[i] = -Math.floor(Math.random() * 30); // Shorter gaps between streams
            }
          }
        }
      });
    };

    let animationId;
    const animate = () => {
      drawRain();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: 'black' }}
      />
      
      {/* Click overlay to enter portal */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 px-4"
        onClick={onEnter}
      >
        <div className="text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
          <p className="text-green-400 text-lg sm:text-xl font-mono mb-4 px-4">Click anywhere to enter</p>
          <div className="animate-pulse">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixLanding;
