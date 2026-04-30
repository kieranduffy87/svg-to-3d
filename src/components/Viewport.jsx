import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { BACKGROUND_OPTIONS, EXPORT_QUALITY } from '../constants'

const HDR_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr'

function buildMeshGroup(svgData, settings) {
  const loader = new SVGLoader()
  const svgResult = loader.parse(svgData)
  const group = new THREE.Group()

  svgResult.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path)
    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: settings.extrusionDepth,
        bevelEnabled: true,
        bevelSize: settings.bevelSize,
        bevelThickness: settings.bevelThickness,
        bevelSegments: settings.bevelSegments || 5,
      })
      const emissiveColor = new THREE.Color(settings.color)
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(settings.color),
        roughness: settings.roughness,
        metalness: settings.metalness,
        clearcoat: settings.clearcoat,
        clearcoatRoughness: settings.clearcoatRoughness,
        transmission: settings.transmission,
        ior: settings.ior,
        thickness: settings.thickness,
        emissive: emissiveColor,
        emissiveIntensity: settings.emissiveIntensity || 0,
        side: THREE.DoubleSide,
        envMapIntensity: 1.5,
      })
      group.add(new THREE.Mesh(geometry, material))
    })
  })

  // Center and flip Y (SVG coordinate system)
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  group.position.sub(center)
  group.scale.y *= -1

  return { group, size: box.getSize(new THREE.Vector3()) }
}

function applyBackground(scene, renderer, bgKey, containerEl) {
  const opt = BACKGROUND_OPTIONS[bgKey]
  if (!opt) return

  if (opt.transparent) {
    renderer.setClearColor(0x000000, 0)
    scene.background = null
    containerEl.style.backgroundImage = 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%)'
    containerEl.style.backgroundSize = '20px 20px'
    containerEl.style.backgroundPosition = '0 0'
  } else {
    renderer.setClearColor(opt.color, 1)
    scene.background = new THREE.Color(opt.color)
    containerEl.style.backgroundImage = ''
  }
}

async function captureFramesGIF(renderer, scene, camera, meshGroup, settings, onDone) {
  const { width, height } = EXPORT_QUALITY[settings.exportQuality]
  const fps = settings.exportFps
  const duration = settings.exportDuration
  const totalFrames = Math.round(duration * fps)
  const frameDelay = Math.round(1000 / fps)

  const origW = renderer.domElement.width
  const origH = renderer.domElement.height
  const origAspect = camera.aspect

  // Resize for export quality
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  const startRotation = meshGroup.rotation.y
  const GIF = (await import('gif.js')).default
  const gif = new GIF({
    workers: 2,
    quality: 8,
    width,
    height,
    workerScript: '/gif.worker.js',
  })

  for (let i = 0; i < totalFrames; i++) {
    const progress = i / totalFrames
    meshGroup.rotation.y = startRotation + progress * Math.PI * 2
    renderer.render(scene, camera)
    gif.addFrame(renderer.domElement, { delay: frameDelay, copy: true })
  }

  meshGroup.rotation.y = startRotation
  renderer.setSize(origW, origH, false)
  camera.aspect = origAspect
  camera.updateProjectionMatrix()

  gif.on('finished', (blob) => onDone(blob, 'animation.gif'))
  gif.render()
}

async function captureVideoFrames(renderer, scene, camera, meshGroup, settings, mimeType, onDone) {
  const { width, height } = EXPORT_QUALITY[settings.exportQuality]
  const fps = settings.exportFps
  const duration = settings.exportDuration

  const origW = renderer.domElement.width
  const origH = renderer.domElement.height
  const origAspect = camera.aspect

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  const stream = renderer.domElement.captureStream(fps)
  const chunks = []

  // Check codec support
  const bestMime = MediaRecorder.isTypeSupported(mimeType) ? mimeType
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
    : 'video/webm'

  const recorder = new MediaRecorder(stream, {
    mimeType: bestMime,
    videoBitsPerSecond: 8_000_000,
  })
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }

  const ext = mimeType.includes('mp4') && MediaRecorder.isTypeSupported(mimeType) ? 'mp4' : 'webm'

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: bestMime })
    renderer.setSize(origW, origH, false)
    camera.aspect = origAspect
    camera.updateProjectionMatrix()
    onDone(blob, `animation.${ext}`)
  }

  const startRotation = meshGroup.rotation.y
  const startTime = performance.now()
  recorder.start()

  const recordFrame = () => {
    const elapsed = performance.now() - startTime
    const progress = Math.min(elapsed / (duration * 1000), 1)
    meshGroup.rotation.y = startRotation + progress * Math.PI * 2
    renderer.render(scene, camera)
    if (progress < 1) {
      requestAnimationFrame(recordFrame)
    } else {
      meshGroup.rotation.y = startRotation
      recorder.stop()
    }
  }
  requestAnimationFrame(recordFrame)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Viewport({ svgData, settings, exporting, setExporting }) {
  const containerRef = useRef(null)
  const stateRef = useRef({})

  // Build the Three.js scene once
  const setupScene = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (stateRef.current.cleanup) stateRef.current.cleanup()

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
    camera.position.set(0, 0, 150)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enablePan = true

    // Three-point lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2)
    keyLight.position.set(50, 80, 60)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x8888ff, 1)
    fillLight.position.set(-50, 20, 40)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffaa44, 1.5)
    rimLight.position.set(0, -20, -60)
    scene.add(rimLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    // HDR environment
    new HDRLoader().load(HDR_URL, (hdrTex) => {
      hdrTex.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = hdrTex
    }, undefined, () => {
      // Fallback to generated env
      const pmrem = new THREE.PMREMGenerator(renderer)
      const rt = pmrem.fromScene(new RoomEnvironment())
      scene.environment = rt.texture
      pmrem.dispose()
    })

    // Build mesh group from SVG
    const { group: meshGroup, size } = buildMeshGroup(svgData, settings)
    const maxDim = Math.max(size.x, size.y, size.z)
    camera.position.set(0, 0, maxDim * 2.2)
    controls.update()
    scene.add(meshGroup)

    // Apply background
    applyBackground(scene, renderer, settings.background, container)

    stateRef.current = {
      renderer, scene, camera, controls, meshGroup,
      keyLight, fillLight, rimLight, ambientLight,
      animTime: 0,
      cleanup: () => {
        renderer.dispose()
        controls.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      },
    }
  }, [svgData])

  useEffect(() => {
    setupScene()
    return () => { if (stateRef.current.cleanup) stateRef.current.cleanup() }
  }, [setupScene])

  // Reactive: material + lights
  useEffect(() => {
    const s = stateRef.current
    if (!s.meshGroup) return
    s.meshGroup.traverse((child) => {
      if (!child.isMesh) return
      child.material.color.set(settings.color)
      child.material.roughness = settings.roughness
      child.material.metalness = settings.metalness
      child.material.clearcoat = settings.clearcoat
      child.material.clearcoatRoughness = settings.clearcoatRoughness
      child.material.transmission = settings.transmission
      child.material.ior = settings.ior
      child.material.thickness = settings.thickness
      child.material.emissive.set(settings.color)
      child.material.emissiveIntensity = settings.emissiveIntensity || 0
      child.material.needsUpdate = true
    })
    if (s.keyLight) {
      const i = settings.lightIntensity
      s.keyLight.intensity = 2 * i
      s.fillLight.intensity = 1 * i
      s.rimLight.intensity = 1.5 * i
      s.ambientLight.intensity = 0.4 * i
    }
  }, [settings.color, settings.roughness, settings.metalness, settings.clearcoat,
      settings.clearcoatRoughness, settings.transmission, settings.ior,
      settings.thickness, settings.lightIntensity, settings.emissiveIntensity])

  // Reactive: geometry rebuild
  useEffect(() => {
    const s = stateRef.current
    if (!s.meshGroup || !svgData) return

    while (s.meshGroup.children.length) {
      const c = s.meshGroup.children[0]
      c.geometry.dispose()
      c.material.dispose()
      s.meshGroup.remove(c)
    }

    const { group: newGroup } = buildMeshGroup(svgData, settings)
    newGroup.children.forEach((c) => {
      s.meshGroup.add(c.clone())
    })
    // Re-center
    const box = new THREE.Box3().setFromObject(s.meshGroup)
    const center = box.getCenter(new THREE.Vector3())
    s.meshGroup.position.sub(center)
  }, [settings.extrusionDepth, settings.bevelSize, settings.bevelThickness, settings.bevelSegments, svgData])

  // Reactive: background
  useEffect(() => {
    const s = stateRef.current
    const container = containerRef.current
    if (!s.renderer || !container) return
    applyBackground(s.scene, s.renderer, settings.background, container)
  }, [settings.background])

  // Animation loop
  useEffect(() => {
    const s = stateRef.current
    if (!s.renderer) return
    let animId
    let lastTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      s.animTime = (s.animTime || 0) + delta

      if (s.meshGroup) {
        const t = s.animTime

        // Base rotation speed
        s.meshGroup.rotation.y += settings.rotationSpeed * delta

        switch (settings.animationPreset) {
          case 'spin':
            s.meshGroup.rotation.y += 1.2 * delta
            break
          case 'float':
            s.meshGroup.position.y = Math.sin(t * 1.2) * 5
            s.meshGroup.rotation.x = Math.sin(t * 0.6) * 0.06
            break
          case 'wobble':
            s.meshGroup.rotation.x = Math.sin(t * 2.5) * 0.18
            s.meshGroup.rotation.z = Math.cos(t * 1.8) * 0.12
            break
          case 'pulse': {
            const sc = 1 + Math.sin(t * 2.5) * 0.06
            const sy = Math.sign(s.meshGroup.scale.y)
            s.meshGroup.scale.set(sc, sc * sy, sc)
            break
          }
          case 'orbit':
            s.meshGroup.rotation.y += 0.6 * delta
            s.meshGroup.rotation.x = Math.sin(t * 0.4) * 0.3
            break
        }
      }

      s.controls.update()
      s.renderer.render(s.scene, s.camera)
    }

    animate()
    return () => cancelAnimationFrame(animId)
  }, [settings.rotationSpeed, settings.animationPreset])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const s = stateRef.current
      const container = containerRef.current
      if (!s.renderer || !container) return
      const w = container.clientWidth
      const h = container.clientHeight
      s.camera.aspect = w / h
      s.camera.updateProjectionMatrix()
      s.renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // GLB Export
  useEffect(() => {
    const handle = () => {
      const s = stateRef.current
      if (!s.meshGroup) return
      new GLTFExporter().parse(s.meshGroup, (result) => {
        downloadBlob(new Blob([result], { type: 'application/octet-stream' }), 'model.glb')
      }, console.error, { binary: true })
    }
    window.addEventListener('export-glb', handle)
    return () => window.removeEventListener('export-glb', handle)
  }, [])

  // Video/GIF Export
  useEffect(() => {
    if (!exporting) return
    const s = stateRef.current
    if (!s.renderer || !s.meshGroup) { setExporting(false); return }

    const fmt = settings.exportFormat

    const onDone = (blob, filename) => {
      downloadBlob(blob, filename)
      setExporting(false)
    }

    if (fmt === 'gif') {
      captureFramesGIF(s.renderer, s.scene, s.camera, s.meshGroup, settings, onDone)
        .catch((e) => { console.error(e); setExporting(false) })
    } else {
      const mimeType = fmt === 'mp4' ? 'video/mp4' : 'video/webm;codecs=vp9'
      captureVideoFrames(s.renderer, s.scene, s.camera, s.meshGroup, settings, mimeType, onDone)
        .catch((e) => { console.error(e); setExporting(false) })
    }
  }, [exporting])

  const bgOpt = BACKGROUND_OPTIONS[settings.background]

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={bgOpt?.transparent
        ? { backgroundImage: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%)', backgroundSize: '20px 20px' }
        : {}}
    />
  )
}
