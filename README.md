# Drepheus Portal - Matrix Digital Rain Effect

A cinematic Matrix Digital Rain background effect built with React.js, Three.js, GSAP, and Framer Motion. This project recreates the iconic Matrix digital rain with advanced 3D effects, shaders, and interactive elements.

## 🎯 Features

### Core Effects
- **3D Perspective**: Characters have depth with dynamic scaling as they fall
- **WebGL Shaders**: High-performance rendering with custom GLSL shaders
- **Glow & Neon Effects**: CSS filters and WebGL shaders for authentic Matrix look
- **Motion Blur & Flickering**: Advanced visual effects for lifelike streams
- **Character Glitching**: Characters ripple, fade, and transform dynamically
- **Interactive Parallax**: Mouse movement creates "world is bending" effect

### Advanced Features
- **Multiple Themes**: Classic Matrix green, cyber blue, golden code, ghost white
- **Ambient Particles**: Floating sparks and glitches in 3D space
- **Performance Optimized**: Canvas/WebGL rendering, no heavy DOM manipulation
- **Responsive Design**: Adapts to all screen sizes
- **Customizable Settings**: Adjustable density, glitch intensity, and effects

### Technical Stack
- **React.js**: Component-based architecture
- **Three.js + @react-three/fiber**: 3D rendering and WebGL
- **GSAP**: Smooth animations and transitions
- **Framer Motion**: UI animations and entrance effects
- **TailwindCSS**: Utility-first styling
- **Custom GLSL Shaders**: Advanced visual effects

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern browser with WebGL support

### Installation

1. **Clone and setup:**
   ```powershell
   cd c:\Users\ajgre\Drepheus-Portal
   npm install
   ```

2. **Start development server:**
   ```powershell
   npm start
   ```

3. **Open browser:**
   Visit `http://localhost:3000` to see the Matrix effect in action!

### Build for Production
```powershell
npm run build
```

## 🎛️ Usage Examples

### Basic Implementation
```jsx
import MatrixRain from './components/MatrixRain';

function App() {
  return (
    <div className="relative">
      <MatrixRain theme="green" />
      <div className="relative z-10">
        {/* Your content here */}
        <h1>Welcome to the Matrix</h1>
      </div>
    </div>
  );
}
```

### Advanced Configuration
```jsx
import MatrixRain from './components/MatrixRain';

const settings = {
  streamDensity: 75,        // Number of character streams (20-100)
  glitchIntensity: 0.05,    // How much characters glitch (0-0.1)
  ambientParticles: true,   // Enable floating particles
  motionBlur: true,         // Add motion blur effect
  interactive: true         // Enable mouse parallax
};

function MatrixPage() {
  return (
    <MatrixRain 
      theme="blue"           // 'green', 'blue', 'gold', 'white'
      settings={settings}
      className="custom-matrix"
    />
  );
}
```

### Using Advanced Shader Version
```jsx
import AdvancedMatrixRain from './components/AdvancedMatrixRain';

function HighPerformanceMatrix() {
  return (
    <AdvancedMatrixRain 
      theme="green"
      settings={{
        streamDensity: 60,
        glitchIntensity: 0.03,
        ambientParticles: true,
        useShaders: true      // Enable GLSL shaders for better performance
      }}
    />
  );
}
```

## 🎨 Customization

### Available Themes
- **green**: Classic Matrix green (default)
- **blue**: Cyber blue theme
- **gold**: Golden code theme  
- **white**: Ghost white theme

### Settings Options
```javascript
const defaultSettings = {
  streamDensity: 50,        // Stream count (affects performance)
  glitchIntensity: 0.02,    // Character glitch amount
  ambientParticles: true,   // Show floating particles
  motionBlur: true,         // Motion blur effect
  interactive: true,        // Mouse interaction
  useShaders: false         // Use WebGL shaders (AdvancedMatrixRain only)
};
```

### Performance Optimization

For better performance on lower-end devices:
```jsx
const lightSettings = {
  streamDensity: 30,        // Reduce stream count
  glitchIntensity: 0.01,    // Less glitching
  ambientParticles: false,  // Disable particles
  motionBlur: false,        // Disable blur
  useShaders: true          // Use shader version for better performance
};
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── MatrixRain.jsx          # Main Matrix component
│   ├── AdvancedMatrixRain.jsx  # Shader-based version
│   └── MatrixDemo.jsx          # Demo with controls
├── shaders/
│   └── matrixShaders.js        # GLSL shader code
├── App.js                      # Main app component
├── index.js                    # React entry point
└── index.css                   # Global styles
```

## 🎯 Component API

### MatrixRain Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | string | 'green' | Color theme |
| `className` | string | '' | Additional CSS classes |
| `settings` | object | defaultSettings | Effect configuration |

### Settings Object
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `streamDensity` | number | 50 | Number of character streams |
| `glitchIntensity` | number | 0.02 | Character glitch amount |
| `ambientParticles` | boolean | true | Show floating particles |
| `motionBlur` | boolean | true | Motion blur effect |
| `interactive` | boolean | true | Mouse parallax interaction |

## 🚀 Performance Tips

1. **Use shader version** for better performance on supported devices
2. **Reduce streamDensity** on mobile devices
3. **Disable ambientParticles** for lower-end hardware
4. **Turn off motionBlur** if experiencing frame drops
5. **Use production build** for optimal performance

## 🎮 Interactive Demo

The included demo (`MatrixDemo.jsx`) provides:
- Live theme switching
- Real-time settings adjustment
- Performance monitoring
- Mobile-responsive controls

## 🛠️ Development

### Adding New Themes
Add to the THEMES object in `MatrixRain.jsx`:
```javascript
const THEMES = {
  // ... existing themes
  purple: { 
    primary: '#8b5cf6', 
    secondary: '#2d1b69', 
    bright: '#a855f7' 
  }
};
```

### Custom Shaders
Modify `matrixShaders.js` to add new visual effects:
```glsl
// Add in fragment shader
float customEffect = sin(time * frequency + vUv.x * amplitude);
color *= customEffect;
```

## 📱 Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: WebGL effects may vary
- **Mobile**: Optimized settings recommended

## ⚡ Performance Benchmarks

| Device Type | Recommended Settings |
|-------------|---------------------|
| Desktop (High-end) | streamDensity: 80, all effects enabled |
| Desktop (Mid-range) | streamDensity: 50, standard settings |
| Mobile (Modern) | streamDensity: 30, particles disabled |
| Mobile (Older) | streamDensity: 20, minimal effects |

## 🎯 Next Steps

1. **Integration**: Add the MatrixRain component to your landing pages
2. **Customization**: Experiment with different themes and settings
3. **Performance**: Test on target devices and optimize settings
4. **Enhancement**: Add custom shapes or patterns for brand integration

## 📄 License

This project is part of the Drepheus Portal. Use responsibly and enjoy the Matrix! 🕶️

---

**Remember**: There is no spoon... but there is amazing code! 🥄✨
