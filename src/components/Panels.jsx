import { MATERIAL_PRESETS, MATERIAL_PREVIEWS, BACKGROUND_OPTIONS, ANIMATION_PRESETS, EXPORT_QUALITY } from '../constants'

// ─── Icons ───────────────────────────────────────────────────────────────────
export const Icons = {
  Geometry: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  Material: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <ellipse cx="12" cy="12" rx="4" ry="9"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
    </svg>
  ),
  Background: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  Animation: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Export: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
}

export const NAV_ITEMS = [
  { key: 'geometry',   label: 'Geometry',   Ico: Icons.Geometry },
  { key: 'material',   label: 'Material',   Ico: Icons.Material },
  { key: 'background', label: 'BG',         Ico: Icons.Background },
  { key: 'animation',  label: 'Animation',  Ico: Icons.Animation },
  { key: 'export',     label: 'Export',     Ico: Icons.Export },
]

// ─── Primitives ───────────────────────────────────────────────────────────────
export function Slider({ label, value, onChange, min, max, step = 0.01 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.01em' }}>{label}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
          {typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 10, marginTop: 4 }}>
      {children}
    </div>
  )
}

// ─── Panels ───────────────────────────────────────────────────────────────────
export function GeometryPanel({ settings, updateSetting }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <Slider label="Extrusion Depth"  value={settings.extrusionDepth}  onChange={v => updateSetting('extrusionDepth', v)}  min={1}   max={100} step={1} />
      <Slider label="Bevel Size"       value={settings.bevelSize}       onChange={v => updateSetting('bevelSize', v)}       min={0}   max={10}  step={0.1} />
      <Slider label="Bevel Thickness"  value={settings.bevelThickness}  onChange={v => updateSetting('bevelThickness', v)}  min={0}   max={10}  step={0.1} />
      <Slider label="Bevel Segments"   value={settings.bevelSegments}   onChange={v => updateSetting('bevelSegments', v)}   min={1}   max={10}  step={1} />
    </div>
  )
}

export function MaterialPanel({ settings, updateSetting, setSettings }) {
  const applyPreset = (name) => {
    const preset = MATERIAL_PRESETS[name]
    setSettings(prev => ({ ...prev, ...preset, materialPreset: name }))
  }
  return (
    <div>
      <SectionLabel>Presets</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
        {Object.entries(MATERIAL_PRESETS).map(([key, { label }]) => (
          <button key={key} onClick={() => applyPreset(key)} title={label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            padding: '8px 4px', borderRadius: 10, cursor: 'pointer', border: 'none',
            background: settings.materialPreset === key ? 'rgba(255,255,255,0.1)' : 'transparent',
            outline: settings.materialPreset === key ? '1px solid rgba(255,255,255,0.2)' : 'none',
            transition: 'all 0.15s',
          }}>
            <div className={MATERIAL_PREVIEWS[key]} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', lineHeight: 1, textAlign: 'center' }}>{label}</span>
          </button>
        ))}
      </div>
      <SectionLabel>Adjust</SectionLabel>
      <Slider label="Roughness"    value={settings.roughness}    onChange={v => updateSetting('roughness', v)}    min={0} max={1} />
      <Slider label="Metalness"    value={settings.metalness}    onChange={v => updateSetting('metalness', v)}    min={0} max={1} />
      <Slider label="Clearcoat"    value={settings.clearcoat}    onChange={v => updateSetting('clearcoat', v)}    min={0} max={1} />
      <Slider label="Transmission" value={settings.transmission} onChange={v => updateSetting('transmission', v)} min={0} max={1} />
      <Slider label="IOR"          value={settings.ior}          onChange={v => updateSetting('ior', v)}          min={1} max={2.5} step={0.01} />
      <Slider label="Thickness"    value={settings.thickness}    onChange={v => updateSetting('thickness', v)}    min={0} max={5}   step={0.1} />
      {settings.materialPreset === 'neon' && (
        <Slider label="Glow Intensity" value={settings.emissiveIntensity} onChange={v => updateSetting('emissiveIntensity', v)} min={0} max={2} step={0.05} />
      )}
      <SectionLabel>Color</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <input type="color" value={settings.color}
          onChange={e => { updateSetting('color', e.target.value); updateSetting('materialPreset', 'custom') }}
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'none', cursor: 'pointer', padding: 2 }}
        />
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{settings.color}</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <Slider label="Light Intensity" value={settings.lightIntensity} onChange={v => updateSetting('lightIntensity', v)} min={0} max={5} step={0.1} />
      </div>
    </div>
  )
}

export function BackgroundPanel({ settings, updateSetting }) {
  return (
    <div>
      <SectionLabel>Scene Background</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {Object.entries(BACKGROUND_OPTIONS).map(([key, opt]) => (
          <button key={key} onClick={() => updateSetting('background', key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '8px 6px', borderRadius: 12, cursor: 'pointer',
            border: settings.background === key ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
            background: settings.background === key ? 'rgba(255,255,255,0.06)' : 'transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{
              width: '100%', height: 32, borderRadius: 8,
              ...(opt.transparent
                ? { backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, rgba(255,255,255,0.02) 0% 50%)', backgroundSize: '10px 10px' }
                : { background: opt.color }),
            }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function AnimationPanel({ settings, updateSetting }) {
  return (
    <div>
      <SectionLabel>Style</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {Object.entries(ANIMATION_PRESETS).map(([key, { label, icon }]) => (
          <button key={key} onClick={() => updateSetting('animationPreset', key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '10px 8px', borderRadius: 12, cursor: 'pointer',
            border: settings.animationPreset === key ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
            background: settings.animationPreset === key ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: settings.animationPreset === key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </div>
      <Slider label="Rotation Speed" value={settings.rotationSpeed} onChange={v => updateSetting('rotationSpeed', v)} min={0} max={5} step={0.05} />
    </div>
  )
}

export function ExportPanel({ settings, updateSetting, hasMesh, exporting, setExporting }) {
  const ToggleRow = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom: 18 }}>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map(opt => (
          <button key={opt.key} onClick={() => onChange(opt.key)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 999, cursor: 'pointer', border: 'none',
            background: value === opt.key ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.06)',
            color: value === opt.key ? '#0b0b0f' : 'rgba(255,255,255,0.5)',
            fontSize: 11, fontWeight: value === opt.key ? 600 : 400,
            transition: 'all 0.15s',
          }}>
            <div>{opt.label}</div>
            {opt.sub && <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>{opt.sub}</div>}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <ToggleRow label="Format"
        options={[{ key: 'webm', label: 'WEBM', sub: 'Best quality' }, { key: 'mp4', label: 'MP4', sub: 'Compatible' }, { key: 'gif', label: 'GIF', sub: 'Animated' }]}
        value={settings.exportFormat} onChange={v => updateSetting('exportFormat', v)}
      />
      <ToggleRow label="Frame Rate"
        options={[{ key: 30, label: '30 FPS' }, { key: 60, label: '60 FPS' }]}
        value={settings.exportFps} onChange={v => updateSetting('exportFps', v)}
      />
      <ToggleRow label="Quality"
        options={Object.entries(EXPORT_QUALITY).map(([k, v]) => ({ key: k, label: v.label, sub: v.sub }))}
        value={settings.exportQuality} onChange={v => updateSetting('exportQuality', v)}
      />
      <Slider label="Duration (seconds)" value={settings.exportDuration} onChange={v => updateSetting('exportDuration', v)} min={1} max={10} step={0.5} />
      <button disabled={!hasMesh || exporting} onClick={() => setExporting(true)} style={{
        width: '100%', padding: '11px', borderRadius: 12, border: 'none',
        background: exporting ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)',
        color: exporting ? 'rgba(255,255,255,0.4)' : '#0b0b0f',
        fontSize: 13, fontWeight: 600, cursor: hasMesh && !exporting ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        transition: 'all 0.2s', marginBottom: 10,
        opacity: !hasMesh ? 0.4 : 1,
      }}>
        {exporting ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Exporting…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export {settings.exportFormat.toUpperCase()}
          </>
        )}
      </button>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
        <button disabled={!hasMesh} onClick={() => window.dispatchEvent(new CustomEvent('export-glb'))} style={{
          width: '100%', padding: '9px', borderRadius: 12, cursor: hasMesh ? 'pointer' : 'not-allowed',
          border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.15s', opacity: !hasMesh ? 0.4 : 1,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          Export GLB
        </button>
      </div>
    </div>
  )
}
