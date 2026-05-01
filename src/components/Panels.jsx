import { MATERIAL_PRESETS, MATERIAL_PREVIEWS, BACKGROUND_OPTIONS, ANIMATION_PRESETS, EXPORT_QUALITY, CAMERA_PRESETS } from '../constants'

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
  Render: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
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
  { key: 'render',     label: 'Render',     Ico: Icons.Render },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
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
      <Slider label="Iridescence"  value={settings.iridescence}  onChange={v => updateSetting('iridescence', v)}  min={0} max={1} />
      <Slider label="Anisotropy"   value={settings.anisotropy}   onChange={v => updateSetting('anisotropy', v)}   min={0} max={1} />
      {settings.emissiveIntensity > 0 || settings.materialPreset === 'neon' ? (
        <Slider label="Glow Intensity" value={settings.emissiveIntensity} onChange={v => updateSetting('emissiveIntensity', v)} min={0} max={2} step={0.05} />
      ) : null}
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
                : key === 'custom'
                ? { background: settings.customBgColor }
                : { background: opt.color }),
            }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Custom color picker — shown when custom is selected */}
      {settings.background === 'custom' && (
        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <input
            type="color"
            value={settings.customBgColor}
            onChange={e => updateSetting('customBgColor', e.target.value)}
            style={{
              width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'none', cursor: 'pointer', padding: 2, flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', marginBottom: 2 }}>
              {settings.customBgColor}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Click to pick any color</div>
          </div>
        </div>
      )}
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
      <Slider label="Rotation Speed"  value={settings.rotationSpeed}  onChange={v => updateSetting('rotationSpeed', v)}  min={0} max={5}   step={0.05} />
      <Slider label="Animation Speed" value={settings.animationSpeed} onChange={v => updateSetting('animationSpeed', v)} min={0} max={4}   step={0.05} />
    </div>
  )
}

export function RenderPanel({ settings, updateSetting }) {
  return (
    <div>
      <SectionLabel>Camera</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
        {CAMERA_PRESETS.map(({ key, label, dir }) => (
          <button key={key}
            onClick={() => window.dispatchEvent(new CustomEvent('set-camera-preset', { detail: { dir } }))}
            style={{
              padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            {label}
          </button>
        ))}
      </div>

      <SectionLabel>Ground</SectionLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => updateSetting('showGround', !settings.showGround)} style={{
          padding: '7px 18px', borderRadius: 999, cursor: 'pointer', fontSize: 12, border: 'none',
          background: settings.showGround ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.06)',
          color: settings.showGround ? '#0b0b0f' : 'rgba(255,255,255,0.4)',
          fontWeight: 500, transition: 'all 0.15s',
        }}>
          {settings.showGround ? 'Visible' : 'Hidden'}
        </button>
      </div>
      {settings.showGround && (
        <Slider label="Reflection Opacity" value={settings.groundOpacity} onChange={v => updateSetting('groundOpacity', v)} min={0} max={1} step={0.01} />
      )}

      <SectionLabel>Path Tracer</SectionLabel>
      <div style={{ marginBottom: 18 }}>
        <button onClick={() => updateSetting('usePathTracer', !settings.usePathTracer)} style={{
          width: '100%', padding: '10px 16px', borderRadius: 12, cursor: 'pointer', border: 'none',
          background: settings.usePathTracer ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.06)',
          color: settings.usePathTracer ? '#0b0b0f' : 'rgba(255,255,255,0.5)',
          fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          {settings.usePathTracer ? 'Path Tracer On' : 'Path Tracer Off'}
        </button>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 8, lineHeight: 1.5, paddingLeft: 2 }}>
          {settings.usePathTracer
            ? 'Accumulating samples — move camera to reset. Pauses animation.'
            : 'Real-time ray tracing for glass, chrome & reflections.'}
        </div>
      </div>

      <SectionLabel>Post Processing</SectionLabel>
      <Slider label="Bloom Intensity" value={settings.bloomIntensity} onChange={v => updateSetting('bloomIntensity', v)} min={0} max={2} step={0.01} />

      <SectionLabel>Shortcuts</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { key: 'R', desc: 'Reset camera' },
          { key: 'Space', desc: 'Pause / resume' },
          { key: 'S', desc: 'Screenshot PNG' },
        ].map(({ key, desc }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 10, padding: '2px 7px',
              borderRadius: 5, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
              flexShrink: 0,
            }}>{key}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{desc}</span>
          </div>
        ))}
      </div>
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

      <SectionLabel>PNG Still</SectionLabel>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[{ label: '1080p', width: 1920, height: 1080 }, { label: '4K', width: 3840, height: 2160 }].map(({ label, width, height }) => (
          <button key={label} disabled={!hasMesh}
            onClick={() => window.dispatchEvent(new CustomEvent('export-png', { detail: { width, height } }))}
            style={{
              flex: 1, padding: '9px', borderRadius: 12,
              cursor: hasMesh ? 'pointer' : 'not-allowed',
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s', opacity: !hasMesh ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (hasMesh) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            PNG {label}
          </button>
        ))}
      </div>

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
