export const KD_ICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.62 11.73">
  <polygon points="18.62 0 12 0 6 5.86 12 11.73 18.62 11.73 12.62 5.86 18.62 0" fill="#0339f8"/>
  <polygon points="0 0 0 11.72 6 5.86 0 0" fill="#0339f8"/>
</svg>`

export const MATERIAL_PRESETS = {
  plastic:    { label: 'Plastic',    roughness: 0.4,  metalness: 0.0, clearcoat: 0.3,  clearcoatRoughness: 0.2,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#0339f8', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  glass:      { label: 'Glass',      roughness: 0.0,  metalness: 0.0, clearcoat: 1.0,  clearcoatRoughness: 0.0,  transmission: 0.95, ior: 1.5, thickness: 2.0, color: '#aaccff', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  chrome:     { label: 'Chrome',     roughness: 0.05, metalness: 1.0, clearcoat: 0.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#cccccc', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  frosted:    { label: 'Frosted',    roughness: 0.6,  metalness: 0.0, clearcoat: 0.5,  clearcoatRoughness: 0.4,  transmission: 0.7,  ior: 1.4, thickness: 1.5, color: '#ddeeff', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  gold:       { label: 'Gold',       roughness: 0.1,  metalness: 1.0, clearcoat: 0.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#FFD700', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  copper:     { label: 'Copper',     roughness: 0.2,  metalness: 1.0, clearcoat: 0.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#B87333', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  obsidian:   { label: 'Obsidian',   roughness: 0.05, metalness: 0.3, clearcoat: 1.0,  clearcoatRoughness: 0.1,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#1a1020', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  pearl:      { label: 'Pearl',      roughness: 0.1,  metalness: 0.0, clearcoat: 1.0,  clearcoatRoughness: 0.05, transmission: 0,    ior: 1.5, thickness: 0,   color: '#f0eef8', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  rubber:     { label: 'Rubber',     roughness: 0.95, metalness: 0.0, clearcoat: 0.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#222222', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
  neon:       { label: 'Neon',       roughness: 0.1,  metalness: 0.0, clearcoat: 1.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#00ffaa', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0.8 },
  iridescent: { label: 'Iridescent', roughness: 0.05, metalness: 0.0, clearcoat: 1.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#ffffff', iridescence: 1.0, anisotropy: 0,   emissiveIntensity: 0 },
  brushed:    { label: 'Brushed',    roughness: 0.35, metalness: 1.0, clearcoat: 0.0,  clearcoatRoughness: 0.0,  transmission: 0,    ior: 1.5, thickness: 0,   color: '#aaaaaa', iridescence: 0,   anisotropy: 1.0, emissiveIntensity: 0 },
  jade:       { label: 'Jade',       roughness: 0.2,  metalness: 0.0, clearcoat: 0.8,  clearcoatRoughness: 0.1,  transmission: 0.3,  ior: 1.6, thickness: 3.0, color: '#2a7a5a', iridescence: 0,   anisotropy: 0,   emissiveIntensity: 0 },
}

export const MATERIAL_PREVIEWS = {
  plastic:    'bg-blue-500',
  glass:      'bg-gradient-to-br from-sky-200/40 to-blue-300/20 border border-white/40',
  chrome:     'bg-gradient-to-br from-zinc-300 to-zinc-500',
  frosted:    'bg-gradient-to-br from-blue-100/60 to-slate-200/60',
  gold:       'bg-gradient-to-br from-yellow-300 to-yellow-600',
  copper:     'bg-gradient-to-br from-orange-400 to-orange-700',
  obsidian:   'bg-gradient-to-br from-purple-900 to-zinc-950',
  pearl:      'bg-gradient-to-br from-pink-100 to-purple-100',
  rubber:     'bg-zinc-800',
  neon:       'bg-gradient-to-br from-emerald-400 to-cyan-400',
  iridescent: 'bg-gradient-to-br from-pink-400 via-purple-300 to-cyan-400',
  brushed:    'bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-200',
  jade:       'bg-gradient-to-br from-emerald-700 to-teal-600',
}

export const BACKGROUND_OPTIONS = {
  dark:        { label: 'Dark',        color: '#111111', transparent: false },
  midnight:    { label: 'Midnight',    color: '#07091a', transparent: false },
  studio:      { label: 'Studio',      color: '#2d2d2d', transparent: false },
  light:       { label: 'Light',       color: '#f0f0f0', transparent: false },
  blue:        { label: 'Deep Blue',   color: '#050d2e', transparent: false },
  custom:      { label: 'Custom',      color: null,      transparent: false },
  transparent: { label: 'Transparent', color: null,      transparent: true  },
}

export const ANIMATION_PRESETS = {
  none:    { label: 'None',   icon: '⏹' },
  spin:    { label: 'Spin',   icon: '↻' },
  float:   { label: 'Float',  icon: '↑' },
  wobble:  { label: 'Wobble', icon: '〜' },
  pulse:   { label: 'Pulse',  icon: '◎' },
  orbit:   { label: 'Orbit',  icon: '⬤' },
}

export const CAMERA_PRESETS = [
  { key: 'front', label: 'Front',  dir: [0, 0, 1] },
  { key: 'iso',   label: 'Iso',    dir: [0.6, 0.45, 0.65] },
  { key: 'low',   label: 'Low',    dir: [0.2, -0.18, 0.96] },
  { key: 'top',   label: 'Top',    dir: [0, 1, 0.001] },
]

export const EXPORT_QUALITY = {
  low:    { label: 'Low',    sub: '540p',  width: 960,  height: 540  },
  medium: { label: 'Medium', sub: '720p',  width: 1280, height: 720  },
  high:   { label: 'High',   sub: '1080p', width: 1920, height: 1080 },
}

export const DEFAULT_SETTINGS = {
  // Geometry
  extrusionDepth: 20,
  bevelSize: 1.5,
  bevelThickness: 1.5,
  bevelSegments: 5,
  // Material
  roughness: 0.0,
  metalness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
  transmission: 0.95,
  ior: 1.5,
  thickness: 2.0,
  color: '#0339f8',
  emissiveIntensity: 0,
  iridescence: 0,
  anisotropy: 0,
  materialPreset: 'glass',
  // Background
  background: 'dark',
  customBgColor: '#1a1a2e',
  // Lighting
  lightIntensity: 1.0,
  // Animation
  animationPreset: 'spin',
  rotationSpeed: 0,
  animationSpeed: 1,
  // Render
  showGround: true,
  groundOpacity: 0.22,
  bloomIntensity: 0.18,
  usePathTracer: false,
  // Export
  exportFormat: 'webm',
  exportQuality: 'medium',
  exportFps: 30,
  exportDuration: 3,
}
