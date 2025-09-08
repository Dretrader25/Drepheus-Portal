import React, { useState } from 'react';
import MatrixVideoBackground from './components/MatrixVideoBackground';
import MatrixLanding from './components/MatrixLanding';
import './App.css';

function App() {
  const [showPortal, setShowPortal] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const handleEnterPortal = () => {
    setShowPortal(true);
  };

  const handlePortalButtonClick = () => {
    setShowPasswordInput(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Check if password is correct
    if (password === "10") {
      // Access granted - redirect to Discord
      window.location.href = "https://discord.gg/ffRr5JxNyf";
    } else {
      // Access denied - show blinking message
      setShowAccessDenied(true);
      
      // After 2 seconds, hide message and clear password
      setTimeout(() => {
        setShowAccessDenied(false);
        setPassword('');
      }, 2000);
    }
  };

  if (!showPortal) {
    return <MatrixLanding onEnter={handleEnterPortal} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Matrix Video Background */}
      <MatrixVideoBackground 
        theme="green"
        settings={{
          opacity: 0.85,
          blur: 0,
          interactive: true,
          useYouTube: true
        }}
      />
      
      {/* Drepheus Portal Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <div className="text-center mb-8 px-4 sm:px-8 bg-black/40 backdrop-blur-sm rounded-lg p-6 sm:p-12 border border-green-400/20 w-full max-w-4xl">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 text-green-400" style={{
            fontFamily: 'Courier New, Consolas, Monaco, "Lucida Console", monospace',
            fontWeight: '900',
            letterSpacing: '0.15em',
            textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
            color: '#00ff00',
            textTransform: 'uppercase',
            filter: 'brightness(1.1) contrast(1.2)'
          }}>
            DREPHEUS
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-6 text-green-400" style={{
            fontFamily: 'Courier New, Consolas, Monaco, "Lucida Console", monospace',
            fontWeight: '800',
            letterSpacing: '0.2em',
            textShadow: '0 0 8px #00ff00, 0 0 16px #00ff00',
            color: '#00ff00',
            textTransform: 'uppercase',
            filter: 'brightness(1.1)'
          }}>
            PORTAL
          </h2>
          <p className="text-sm sm:text-lg md:text-xl font-mono text-green-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Welcome to the digital nexus. Enter the portal to access advanced trading systems and market intelligence.
          </p>
          
          {/* Portal Entry Button */}
          <button 
            onClick={handlePortalButtonClick}
            className="px-6 sm:px-10 py-3 font-mono text-base sm:text-lg border-2 border-green-400 hover:bg-green-400/20 transition-all duration-300 text-green-400 hover:shadow-2xl hover:shadow-green-400/30 hover:scale-105 bg-black/50 backdrop-blur-sm w-full sm:w-auto"
          >
            ENTER PORTAL
          </button>
        </div>

        {/* Password Input Overlay */}
        {showPasswordInput && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-black/90 backdrop-blur-sm border border-green-400/50 rounded-lg p-6 sm:p-8 max-w-md w-full"
              style={{
                animation: 'fadeIn 0.5s ease-in-out'
              }}
            >
              <style jsx>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: scale(0.9); }
                  to { opacity: 1; transform: scale(1); }
                }
                @keyframes blink {
                  0%, 50% { opacity: 1; }
                  25%, 75% { opacity: 0.3; }
                }
                .blink-animation {
                  animation: blink 0.5s ease-in-out 4;
                }
              `}</style>
              
              <h2 className="text-xl sm:text-2xl font-mono text-green-400 mb-6 text-center" style={{
                textShadow: '0 0 10px #00ff00'
              }}>
                ACCESS REQUIRED
              </h2>

              {/* Access Denied Message */}
              {showAccessDenied && (
                <div 
                  className="text-center mb-4 p-3 border border-red-500 bg-red-900/20 rounded blink-animation"
                  style={{
                    color: '#ff0000',
                    textShadow: '0 0 10px #ff0000',
                    fontFamily: 'Courier New, monospace',
                    fontWeight: 'bold'
                  }}
                >
                  ACCESS DENIED
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-green-300 font-mono text-xs sm:text-sm mb-2">
                    Enter Password:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 bg-black border border-green-400 text-green-400 font-mono focus:outline-none focus:border-green-300 focus:shadow-lg focus:shadow-green-400/30 text-sm sm:text-base"
                    style={{
                      textShadow: '0 0 5px #00ff00'
                    }}
                    placeholder="****"
                    autoFocus
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 sm:px-6 py-3 font-mono text-sm sm:text-base text-green-400 border border-green-400 hover:bg-green-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/30"
                  >
                    ACCESS
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordInput(false)}
                    className="flex-1 px-4 sm:px-6 py-3 font-mono text-sm sm:text-base text-red-400 border border-red-400 hover:bg-red-400/20 transition-all duration-300"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;