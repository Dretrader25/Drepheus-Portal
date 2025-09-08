import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';

const MatrixDemo = () => {
  const [theme, setTheme] = useState('green');
  const [settings, setSettings] = useState({
    streamDensity: 50,
    glitchIntensity: 0.02,
    ambientParticles: true,
    motionBlur: true,
    interactive: true
  });
  const [showControls, setShowControls] = useState(false);

  const themes = [
    { name: 'green', label: 'Classic Matrix', color: '#00ff00' },
    { name: 'blue', label: 'Cyber Blue', color: '#00ffff' },
    { name: 'gold', label: 'Golden Code', color: '#ffd700' },
    { name: 'white', label: 'Ghost White', color: '#ffffff' }
  ];

  return (
    <div className="relative w-full h-screen">
      {/* Matrix Rain Background */}
      <MatrixRain theme={theme} settings={settings} />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-matrix-green">
            DREPHEUS
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-matrix-lightGreen">
            PORTAL
          </h2>
          <p className="text-lg md:text-xl mt-4 text-gray-300 max-w-2xl">
            Enter the digital realm where code becomes reality
          </p>
        </motion.div>

        {/* Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <button className="px-8 py-3 bg-matrix-green bg-opacity-20 border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all duration-300 font-mono">
            ENTER THE MATRIX
          </button>
          <button 
            onClick={() => setShowControls(!showControls)}
            className="px-8 py-3 bg-transparent border-2 border-matrix-lightGreen text-matrix-lightGreen hover:bg-matrix-lightGreen hover:text-black transition-all duration-300 font-mono"
          >
            CUSTOMIZE
          </button>
        </motion.div>

        {/* Controls Panel */}
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black bg-opacity-80 p-6 rounded-lg border border-matrix-green backdrop-blur-sm max-w-lg w-full mx-4"
          >
            <h3 className="text-xl font-mono text-matrix-green mb-4">Matrix Controls</h3>
            
            {/* Theme Selection */}
            <div className="mb-4">
              <label className="block text-matrix-lightGreen mb-2 font-mono">Color Theme:</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.name}
                    onClick={() => setTheme(themeOption.name)}
                    className={`p-2 border font-mono text-sm transition-all duration-300 ${
                      theme === themeOption.name
                        ? 'border-white bg-white bg-opacity-20 text-white'
                        : 'border-gray-500 text-gray-300 hover:border-white'
                    }`}
                    style={{ 
                      borderColor: theme === themeOption.name ? themeOption.color : undefined,
                      color: theme === themeOption.name ? themeOption.color : undefined
                    }}
                  >
                    {themeOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stream Density */}
            <div className="mb-4">
              <label className="block text-matrix-lightGreen mb-2 font-mono">
                Stream Density: {settings.streamDensity}
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.streamDensity}
                onChange={(e) => setSettings({
                  ...settings,
                  streamDensity: parseInt(e.target.value)
                })}
                className="w-full accent-matrix-green"
              />
            </div>

            {/* Glitch Intensity */}
            <div className="mb-4">
              <label className="block text-matrix-lightGreen mb-2 font-mono">
                Glitch Intensity: {Math.round(settings.glitchIntensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={settings.glitchIntensity}
                onChange={(e) => setSettings({
                  ...settings,
                  glitchIntensity: parseFloat(e.target.value)
                })}
                className="w-full accent-matrix-green"
              />
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              {[
                { key: 'ambientParticles', label: 'Ambient Particles' },
                { key: 'motionBlur', label: 'Motion Blur' },
                { key: 'interactive', label: 'Mouse Interaction' }
              ].map((option) => (
                <label key={option.key} className="flex items-center text-matrix-lightGreen font-mono">
                  <input
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={(e) => setSettings({
                      ...settings,
                      [option.key]: e.target.checked
                    })}
                    className="mr-2 accent-matrix-green"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowControls(false)}
              className="mt-4 w-full py-2 bg-matrix-green bg-opacity-20 border border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all duration-300 font-mono"
            >
              CLOSE
            </button>
          </motion.div>
        )}
      </div>

      {/* Performance indicator */}
      <div className="absolute bottom-4 right-4 z-10 text-matrix-green font-mono text-sm opacity-50">
        Matrix v2.0 - {theme.toUpperCase()} MODE
      </div>
    </div>
  );
};

export default MatrixDemo;
