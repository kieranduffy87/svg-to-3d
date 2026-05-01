import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Viewport from './components/Viewport'
import DropZone from './components/DropZone'
import { DEFAULT_SETTINGS, KD_ICON_SVG } from './constants'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function App() {
  const [svgData, setSvgData] = useState(KD_ICON_SVG)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [exporting, setExporting] = useState(false)
  const isMobile = useIsMobile()

  const handleSvgUpload = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => setSvgData(e.target.result)
    reader.readAsText(file)
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const sidebar = (
    <Sidebar
      settings={settings}
      updateSetting={updateSetting}
      setSettings={setSettings}
      hasMesh={!!svgData}
      exporting={exporting}
      setExporting={setExporting}
      onUpload={handleSvgUpload}
      isMobile={isMobile}
    />
  )

  const viewport = (
    <div style={{ flex: 1, position: 'relative', zIndex: 5, minHeight: 0 }}>
      {svgData ? (
        <Viewport
          svgData={svgData}
          settings={settings}
          exporting={exporting}
          setExporting={setExporting}
        />
      ) : (
        <DropZone onUpload={handleSvgUpload} />
      )}

      {/* Upload overlay button */}
      <label
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          letterSpacing: '0.01em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        {!isMobile && 'Upload SVG'}
        <input type="file" accept=".svg" className="hidden" onChange={(e) => { if (e.target.files[0]) handleSvgUpload(e.target.files[0]) }} />
      </label>
    </div>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100svh',
        width: '100vw',
        overflow: 'hidden',
        background: '#0b0b0f',
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          bottom: '-20vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          height: '65vh',
          background: [
            'radial-gradient(ellipse 60% 80% at 30% 100%, rgba(110,60,200,0.22) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 70% at 65% 100%, rgba(60,100,220,0.16) 0%, transparent 55%)',
            'radial-gradient(ellipse 45% 60% at 80% 100%, rgba(190,90,130,0.12) 0%, transparent 55%)',
          ].join(', '),
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {isMobile ? (
        <>
          {viewport}
          <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
            {sidebar}
          </div>
        </>
      ) : (
        <>
          <div style={{ position: 'relative', zIndex: 10 }}>
            {sidebar}
          </div>
          {viewport}
        </>
      )}
    </div>
  )
}
