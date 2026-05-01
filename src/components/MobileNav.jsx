import { useState, useEffect } from 'react'
import { NAV_ITEMS, GeometryPanel, MaterialPanel, BackgroundPanel, AnimationPanel, ExportPanel } from './Panels'

const SECTION_LABELS = {
  geometry: 'Geometry',
  material: 'Material',
  background: 'Background',
  animation: 'Animation',
  export: 'Export',
}

export default function MobileNav({ settings, updateSetting, setSettings, hasMesh, exporting, setExporting, onUpload }) {
  const [activeSection, setActiveSection] = useState(null)

  // Close sheet on outside tap (handled by backdrop)
  const toggle = (key) => setActiveSection(prev => prev === key ? null : key)

  // Close on escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setActiveSection(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const sheetOpen = activeSection !== null

  return (
    <>
      {/* Backdrop — tap to close */}
      {sheetOpen && (
        <div
          onClick={() => setActiveSection(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0,
        bottom: 64, // sits above the nav bar
        height: '55vh',
        background: 'rgba(13,13,18,0.97)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px 20px 0 0',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        transform: sheetOpen ? 'translateY(0)' : 'translateY(105%)',
        transition: 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      }}>
        {/* Drag handle + title */}
        <div style={{ padding: '12px 20px 10px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
              {activeSection ? SECTION_LABELS[activeSection] : ''}
            </span>
            <button onClick={() => setActiveSection(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)', padding: 4,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
          {activeSection === 'geometry'   && <GeometryPanel   settings={settings} updateSetting={updateSetting} />}
          {activeSection === 'material'   && <MaterialPanel   settings={settings} updateSetting={updateSetting} setSettings={setSettings} />}
          {activeSection === 'background' && <BackgroundPanel settings={settings} updateSetting={updateSetting} />}
          {activeSection === 'animation'  && <AnimationPanel  settings={settings} updateSetting={updateSetting} />}
          {activeSection === 'export'     && <ExportPanel     settings={settings} updateSetting={updateSetting} hasMesh={hasMesh} exporting={exporting} setExporting={setExporting} />}
        </div>
      </div>

      {/* Bottom nav bar */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 64,
        background: 'rgba(11,11,15,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 60,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {NAV_ITEMS.map(({ key, label, Ico }) => {
          const active = activeSection === key
          return (
            <button key={key} onClick={() => toggle(key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer',
              color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)',
              transition: 'color 0.15s',
              position: 'relative',
            }}>
              {active && (
                <div style={{
                  position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.7)',
                }} />
              )}
              <Ico />
              <span style={{ fontSize: 10, fontWeight: active ? 500 : 400 }}>{label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
