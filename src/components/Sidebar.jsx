import { useState } from 'react'
import { NAV_ITEMS, GeometryPanel, MaterialPanel, BackgroundPanel, AnimationPanel, RenderPanel, ExportPanel, PresetsPanel } from './Panels'

export default function Sidebar({ settings, updateSetting, setSettings, hasMesh, exporting, setExporting, onUpload }) {
  const [activeSection, setActiveSection] = useState('material')

  return (
    <aside style={{
      width: 260,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      flexShrink: 0,
    }}>
      {/* Logo / Header */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <svg viewBox="0 0 18.62 11.73" style={{ width: 28, height: 18, flexShrink: 0 }}>
          <polygon points="18.62 0 12 0 6 5.86 12 11.73 18.62 11.73 12.62 5.86 18.62 0" fill="#0339f8"/>
          <polygon points="0 0 0 11.72 6 5.86 0 0" fill="rgba(255,255,255,0.9)"/>
        </svg>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
            SVG <span className="display-italic">to</span> 3D
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>Studio</div>
        </div>
        <label style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.4)', transition: 'all 0.15s', flexShrink: 0,
        }}
          title="Upload SVG"
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <input type="file" accept=".svg" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]) }} />
        </label>
      </div>

      {/* Vertical Nav */}
      <nav style={{ padding: '10px 10px 0' }}>
        {NAV_ITEMS.map(({ key, label, Ico }) => {
          const active = activeSection === key
          return (
            <button key={key} onClick={() => setActiveSection(key)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              marginBottom: 2,
              background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.35)',
              fontSize: 13, fontWeight: active ? 500 : 400,
              textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' } }}
            >
              <Ico />
              {label}
              {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />}
            </button>
          )
        })}
      </nav>

      <div style={{ margin: '10px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Section content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
        {activeSection === 'presets'    && <PresetsPanel    setSettings={setSettings} />}
        {activeSection === 'geometry'   && <GeometryPanel   settings={settings} updateSetting={updateSetting} />}
        {activeSection === 'material'   && <MaterialPanel   settings={settings} updateSetting={updateSetting} setSettings={setSettings} />}
        {activeSection === 'background' && <BackgroundPanel settings={settings} updateSetting={updateSetting} />}
        {activeSection === 'animation'  && <AnimationPanel  settings={settings} updateSetting={updateSetting} />}
        {activeSection === 'render'     && <RenderPanel     settings={settings} updateSetting={updateSetting} />}
        {activeSection === 'export'     && <ExportPanel     settings={settings} updateSetting={updateSetting} hasMesh={hasMesh} exporting={exporting} setExporting={setExporting} />}
      </div>
    </aside>
  )
}
