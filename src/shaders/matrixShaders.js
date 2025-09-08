// Vertex shader for Matrix characters
export const matrixVertexShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform float glitchIntensity;
  
  attribute float brightness;
  attribute float charIndex;
  attribute float streamOffset;
  
  varying float vBrightness;
  varying float vCharIndex;
  varying vec2 vUv;
  
  void main() {
    vBrightness = brightness;
    vCharIndex = charIndex;
    vUv = uv;
    
    vec3 pos = position;
    
    // Add glitch effect
    if (glitchIntensity > 0.0) {
      float glitch = sin(time * 50.0 + streamOffset) * glitchIntensity;
      pos.x += glitch * (sin(time * 100.0) > 0.5 ? 1.0 : 0.0);
      pos.y += glitch * 0.5;
    }
    
    // Wave effect
    pos.x += sin(time * 2.0 + streamOffset) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for Matrix characters
export const matrixFragmentShader = `
  uniform float time;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 brightColor;
  uniform float flickerIntensity;
  
  varying float vBrightness;
  varying float vCharIndex;
  varying vec2 vUv;
  
  // Noise function for texture
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  // Character generation based on UV coordinates
  float generateChar(vec2 uv, float charIndex) {
    vec2 grid = floor(uv * 8.0);
    float pattern = random(grid + charIndex);
    
    // Create character-like patterns
    float char = step(0.5, pattern);
    
    // Add some structure to make it look more like text
    if (length(uv - 0.5) < 0.3) {
      char *= step(0.3, random(grid * 2.0 + charIndex));
    }
    
    return char;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Generate character pattern
    float charPattern = generateChar(uv, vCharIndex);
    
    // Color based on brightness
    vec3 color;
    if (vBrightness > 0.8) {
      color = brightColor;
    } else if (vBrightness > 0.5) {
      color = primaryColor;
    } else {
      color = secondaryColor;
    }
    
    // Flickering effect
    float flicker = 1.0 + sin(time * 10.0 + vCharIndex) * flickerIntensity;
    
    // Glow effect
    float glow = 1.0 - length(uv - 0.5) * 2.0;
    glow = pow(glow, 2.0);
    
    // Final alpha based on character pattern and brightness
    float alpha = charPattern * vBrightness * flicker;
    
    // Add glow around bright characters
    if (vBrightness > 0.8) {
      alpha += glow * 0.3;
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Particle system vertex shader
export const particleVertexShader = `
  uniform float time;
  uniform vec2 mouse;
  uniform float mouseInfluence;
  
  attribute float life;
  attribute float size;
  attribute vec3 velocity;
  
  varying float vLife;
  varying float vSize;
  
  void main() {
    vLife = life;
    vSize = size;
    
    vec3 pos = position;
    
    // Mouse interaction
    vec2 mousePos = mouse * 2.0 - 1.0;
    float dist = distance(pos.xy, mousePos);
    if (dist < mouseInfluence) {
      vec2 force = normalize(pos.xy - mousePos) * (1.0 - dist / mouseInfluence) * 0.5;
      pos.xy += force;
    }
    
    // Floating movement
    pos.y += sin(time + pos.x * 10.0) * 0.1;
    pos.x += cos(time * 0.5 + pos.y * 5.0) * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = vSize * (1.0 + sin(time * 2.0) * 0.2);
  }
`;

// Particle system fragment shader
export const particleFragmentShader = `
  uniform vec3 color;
  uniform float time;
  
  varying float vLife;
  varying float vSize;
  
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    
    // Circular particle shape with soft edges
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Sparkle effect
    float sparkle = sin(time * 5.0 + vLife * 10.0) * 0.3 + 0.7;
    
    // Fade based on life
    alpha *= vLife * sparkle;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Background gradient shader
export const backgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = `
  uniform float time;
  uniform vec3 primaryColor;
  uniform vec2 resolution;
  
  varying vec2 vUv;
  
  // Noise functions
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 st = vUv * 2.0 - 1.0;
    st.x *= resolution.x / resolution.y;
    
    // Distance from center
    float dist = length(st);
    
    // Create subtle noise pattern
    float n = smoothNoise(st * 10.0 + time * 0.1);
    n += smoothNoise(st * 20.0 - time * 0.05) * 0.5;
    n += smoothNoise(st * 40.0 + time * 0.02) * 0.25;
    
    // Radial gradient
    float radial = 1.0 - smoothstep(0.0, 1.5, dist);
    
    // Create depth effect
    vec3 color = vec3(0.0);
    color += primaryColor * 0.02 * radial * n;
    color += vec3(0.0, 0.02, 0.0) * (1.0 - radial);
    
    // Add some subtle moving lines
    float lines = sin(st.y * 100.0 + time) * 0.005;
    color += vec3(lines);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
