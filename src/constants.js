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

export const SCENE_PRESETS = [
  {
    key: 'obsidian', label: 'Obsidian Night',
    gradient: 'linear-gradient(135deg, #0a0510 0%, #1a1020 40%, #2d1b3d 100%)',
    accent: '#9b59b6',
    settings: {
      materialPreset: 'obsidian', color: '#1a1020', background: 'midnight',
      animationPreset: 'float', rotationSpeed: 0.3, animationSpeed: 0.8,
      bloomIntensity: 0.5, lightIntensity: 1.1, showGround: true, groundOpacity: 0.35,
      roughness: 0.05, metalness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.1,
      transmission: 0, ior: 1.5, thickness: 0, emissiveIntensity: 0, iridescence: 0.15, anisotropy: 0,
    },
  },
  {
    key: 'ice', label: 'Ice Glass',
    gradient: 'linear-gradient(135deg, #020a24 0%, #051840 50%, #0a2860 100%)',
    accent: '#4a90d9',
    settings: {
      materialPreset: 'glass', color: '#aaccff', background: 'blue',
      animationPreset: 'spin', rotationSpeed: 0, animationSpeed: 0.6,
      bloomIntensity: 0.7, lightIntensity: 1.3, showGround: true, groundOpacity: 0.28,
      roughness: 0, metalness: 0, clearcoat: 1, clearcoatRoughness: 0,
      transmission: 0.95, ior: 1.5, thickness: 2.0, emissiveIntensity: 0, iridescence: 0.2, anisotropy: 0,
    },
  },
  {
    key: 'gold', label: 'Gold Studio',
    gradient: 'linear-gradient(135deg, #1a0d00 0%, #4a2800 50%, #9a6000 100%)',
    accent: '#FFD700',
    settings: {
      materialPreset: 'gold', color: '#FFD700', background: 'studio',
      animationPreset: 'orbit', rotationSpeed: 0, animationSpeed: 0.7,
      bloomIntensity: 0.22, lightIntensity: 1.5, showGround: true, groundOpacity: 0.45,
      roughness: 0.08, metalness: 1.0, clearcoat: 0, clearcoatRoughness: 0,
      transmission: 0, ior: 1.5, thickness: 0, emissiveIntensity: 0, iridescence: 0, anisotropy: 0,
    },
  },
  {
    key: 'neon', label: 'Neon Cyber',
    gradient: 'linear-gradient(135deg, #000d06 0%, #001f10 50%, #003320 100%)',
    accent: '#00ffaa',
    settings: {
      materialPreset: 'neon', color: '#00ffaa', background: 'dark',
      animationPreset: 'spin', rotationSpeed: 0, animationSpeed: 1.2,
      bloomIntensity: 1.4, lightIntensity: 0.7, showGround: true, groundOpacity: 0.18,
      roughness: 0.08, metalness: 0, clearcoat: 1.0, clearcoatRoughness: 0,
      transmission: 0, ior: 1.5, thickness: 0, emissiveIntensity: 0.9, iridescence: 0, anisotropy: 0,
    },
  },
  {
    key: 'chrome', label: 'Chrome Dream',
    gradient: 'linear-gradient(135deg, #666 0%, #aaa 50%, #e8e8e8 100%)',
    accent: '#cccccc',
    settings: {
      materialPreset: 'chrome', color: '#d0d0d0', background: 'light',
      animationPreset: 'wobble', rotationSpeed: 0.2, animationSpeed: 0.9,
      bloomIntensity: 0.08, lightIntensity: 1.6, showGround: true, groundOpacity: 0.55,
      roughness: 0.04, metalness: 1.0, clearcoat: 0, clearcoatRoughness: 0,
      transmission: 0, ior: 1.5, thickness: 0, emissiveIntensity: 0, iridescence: 0, anisotropy: 0.6,
    },
  },
  {
    key: 'jade', label: 'Jade Mist',
    gradient: 'linear-gradient(135deg, #040e09 0%, #0a2018 50%, #153828 100%)',
    accent: '#2a9a6a',
    settings: {
      materialPreset: 'jade', color: '#2a7a5a', background: 'custom', customBgColor: '#08130e',
      animationPreset: 'float', rotationSpeed: 0.1, animationSpeed: 0.7,
      bloomIntensity: 0.18, lightIntensity: 1.1, showGround: true, groundOpacity: 0.22,
      roughness: 0.18, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.08,
      transmission: 0.28, ior: 1.62, thickness: 3.2, emissiveIntensity: 0, iridescence: 0.08, anisotropy: 0,
    },
  },
]

export const BACKGROUND_OPTIONS = {
  dark:        { label: 'Dark',        color: '#111111', transparent: false },
  midnight:    { label: 'Midnight',    color: '#07091a', transparent: false },
  studio:      { label: 'Studio',      color: '#2d2d2d', transparent: false },
  light:       { label: 'Light',       color: '#f0f0f0', transparent: false },
  blue:        { label: 'Deep Blue',   color: '#050d2e', transparent: false },
  hdri:        { label: 'HDRI Env',    color: null,      transparent: false, hdri: true },
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
  // Depth of Field
  dofEnabled: false,
  dofBlur: 0.35,
  // SVG Colors
  useSvgColors: false,
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
