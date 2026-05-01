import { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { WebGLPathTracer } from 'three-gpu-pathtracer'
import { BACKGROUND_OPTIONS, EXPORT_QUALITY } from '../constants'

const HDR_URL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr'

function buildMeshGroup(svgData, settings) {
  const loader = new SVGLoader()
  const svgResult = loader.parse(svgData)
  const group = new THREE.Group()
  let triangles = 0

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(settings.color),
    roughness: settings.roughness,
    metalness: settings.metalness,
    clearcoat: settings.clearcoat,
    clearcoatRoughness: settings.clearcoatRoughness,
    transmission: settings.transmission,
    ior: settings.ior,
    thickness: settings.thickness,
    emissive: new THREE.Color(settings.color),
    emissiveIntensity: settings.emissiveIntensity || 0,
    iridescence: settings.iridescence || 0,
    iridescenceIOR: 1.3,
    anisotropy: settings.anisotropy || 0,
    side: THREE.DoubleSide,
    envMapIntensity: 1.5,
  })

  svgResult.paths.forEach((path) => {
    let shapes = []
    try { shapes = SVGLoader.createShapes(path) } catch (_) {}
    shapes.forEach((shape) => {
      try {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: settings.extrusionDepth,
          bevelEnabled: true,
          bevelSize: settings.bevelSize,
          bevelThickness: settings.bevelThickness,
          bevelSegments: settings.bevelSegments || 5,
        })
        // Skip degenerate geometry that would produce NaN bounding boxes
        const pos = geometry.attributes.position
        if (!pos || pos.count === 0) { geometry.dispose(); return }
        let hasNaN = false
        for (let i = 0; i < Math.min(pos.count, 9); i++) {
          if (!isFinite(pos.getX(i)) || !isFinite(pos.getY(i))) { hasNaN = true; break }
        }
        if (hasNaN) { geometry.dispose(); return }

        triangles += geometry.index
          ? geometry.index.count / 3
          : pos.count / 3
        const mesh = new THREE.Mesh(geometry, material.clone())
        // Store the SVG fill colour so we can apply per-path colouring later
        if (path.color) mesh.userData.svgColor = path.color.clone()
        group.add(mesh)
      } catch (_) { /* skip shapes ExtrudeGeometry can't handle */ }
    })
  })

  if (!group.children.length) return null

  const box = new THREE.Box3().setFromObject(group)
  if (box.isEmpty()) return null
  const sizeVec = box.getSize(new THREE.Vector3())
  // Guard against NaN/Infinity from degenerate geometry
  if (!isFinite(sizeVec.x) || !isFinite(sizeVec.y) || !isFinite(sizeVec.z)) return null

  const center = box.getCenter(new THREE.Vector3())
  group.position.sub(center)
  group.scale.y *= -1

  return { group, size: sizeVec, triangles: Math.round(triangles) }
}

function applyBackground(scene, renderer, bgKey, containerEl, customColor = '#111111', hdrTexture = null) {
  const opt = BACKGROUND_OPTIONS[bgKey]
  if (!opt) return
  containerEl.style.backgroundImage = ''
  containerEl.style.backgroundSize = ''
  containerEl.style.backgroundPosition = ''
  if (opt.transparent) {
    renderer.setClearColor(0x000000, 0)
    scene.background = null
    containerEl.style.backgroundImage = 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%)'
    containerEl.style.backgroundSize = '20px 20px'
    containerEl.style.backgroundPosition = '0 0'
  } else if (opt.hdri) {
    scene.background = hdrTexture || null
    renderer.setClearColor(0x111111, 1)
  } else {
    const color = bgKey === 'custom' ? customColor : opt.color
    renderer.setClearColor(color, 1)
    scene.background = new THREE.Color(color)
  }
  return opt.transparent
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

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  const startRotation = meshGroup.rotation.y
  const GIF = (await import('gif.js')).default
  const gif = new GIF({
    workers: 2, quality: 8, width, height,
    workerScript: import.meta.env.BASE_URL + 'gif.worker.js',
  })

  for (let i = 0; i < totalFrames; i++) {
    meshGroup.rotation.y = startRotation + (i / totalFrames) * Math.PI * 2
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
  const bestMime = MediaRecorder.isTypeSupported(mimeType) ? mimeType
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
    : 'video/webm'
  const recorder = new MediaRecorder(stream, { mimeType: bestMime, videoBitsPerSecond: 8_000_000 })
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
    if (progress < 1) requestAnimationFrame(recordFrame)
    else { meshGroup.rotation.y = startRotation; recorder.stop() }
  }
  requestAnimationFrame(recordFrame)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function Viewport({ svgData, settings, exporting, setExporting }) {
  const containerRef = useRef(null)
  const stateRef = useRef({})
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const [triCount, setTriCount] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const ptCountRef = useRef(null)

  const setupScene = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    // ── Build mesh FIRST — if it fails, keep the old scene alive ────────────
    let meshResult
    try {
      meshResult = buildMeshGroup(svgData, settings)
    } catch (e) {
      console.warn('SVG parse error:', e)
      setUploadError('Could not render this SVG — try a different file.')
      return
    }
    if (!meshResult) {
      setUploadError('No renderable shapes found in this SVG.')
      return
    }
    setUploadError(null)

    // Null out renderer first so the animation loop skips frames during transition
    stateRef.current.renderer = null
    if (stateRef.current.cleanup) stateRef.current.cleanup()

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Path tracer — wrap in try/catch in case of unsupported environments
    let pathTracer = null
    try {
      pathTracer = new WebGLPathTracer(renderer)
      pathTracer.renderScale = 1.0
      pathTracer.bounces = 8
      pathTracer.filterGlossyFactor = 0.25
    } catch (e) {
      console.warn('PathTracer unavailable:', e)
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
    camera.position.set(0, 0, 150)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enablePan = true

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

    new HDRLoader().load(HDR_URL, (hdrTex) => {
      hdrTex.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = hdrTex
      stateRef.current.hdrTexture = hdrTex
      // Apply as visible background if user has HDRI selected
      if (settingsRef.current.background === 'hdri') {
        scene.background = hdrTex
      }
      if (pathTracer) {
        try { pathTracer.setScene(scene, camera) } catch (_) {}
        stateRef.current.ptNeedsReset = true
      }
    }, undefined, () => {
      const pmrem = new THREE.PMREMGenerator(renderer)
      const rt = pmrem.fromScene(new RoomEnvironment())
      scene.environment = rt.texture
      pmrem.dispose()
      if (pathTracer) {
        try { pathTracer.setScene(scene, camera) } catch (_) {}
        stateRef.current.ptNeedsReset = true
      }
    })

    const { group: meshGroup, size, triangles } = meshResult
    const maxDim = Math.max(size.x, size.y, size.z)
    // Start further out and fly in smoothly (auto-frame)
    camera.position.set(0, 0, maxDim * 3.5)
    scene.add(meshGroup)
    setTriCount(triangles)

    // Ground reflection plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        metalness: 0.88,
        roughness: 0.12,
        transparent: true,
        opacity: settings.groundOpacity,
        envMapIntensity: 1.2,
      })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    ground.visible = settings.showGround
    scene.add(ground)

    const meshBox = new THREE.Box3().setFromObject(meshGroup)
    ground.position.y = meshBox.min.y - 1

    const isTransparent = applyBackground(scene, renderer, settings.background, container, settings.customBgColor)
    controls.saveState()
    controls.update()

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), settings.bloomIntensity, 0.4, 0.85)
    composer.addPass(bloomPass)
    const bokehPass = new BokehPass(scene, camera, { focus: maxDim * 3.5, aperture: 0.0008, maxblur: 0.012 })
    bokehPass.enabled = settings.dofEnabled
    composer.addPass(bokehPass)
    composer.addPass(new OutputPass())

    // Initial PT scene build (before HDR — will be rebuilt once HDR loads)
    if (pathTracer) {
      try { pathTracer.setScene(scene, camera) } catch (e) { pathTracer = null }
    }

    stateRef.current = {
      renderer, scene, camera, controls, meshGroup, ground,
      keyLight, fillLight, rimLight, ambientLight,
      composer, bloomPass, bokehPass, pathTracer,
      hdrTexture: null,
      maxDim, animTime: 0, paused: false,
      bgTransparent: isTransparent,
      ptNeedsReset: false, ptSamples: 0, ptEnabled: false,
      // Auto-frame: fly camera from maxDim*3.5 → maxDim*2.2
      targetCamPos: new THREE.Vector3(0, 0, maxDim * 2.2),
      cleanup: () => {
        renderer.dispose()
        controls.dispose()
        composer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      },
    }

    // Reset path tracer and update DoF focus when camera moves
    controls.addEventListener('change', () => {
      stateRef.current.ptNeedsReset = true
      stateRef.current.ptSamples = 0
      if (stateRef.current.bokehPass?.enabled) {
        stateRef.current.bokehPass.uniforms['focus'].value = stateRef.current.camera.position.length()
      }
    })
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
      const useColor = (settings.useSvgColors && child.userData.svgColor)
        ? child.userData.svgColor
        : new THREE.Color(settings.color)
      child.material.color.copy(useColor)
      child.material.roughness = settings.roughness
      child.material.metalness = settings.metalness
      child.material.clearcoat = settings.clearcoat
      child.material.clearcoatRoughness = settings.clearcoatRoughness
      child.material.transmission = settings.transmission
      child.material.ior = settings.ior
      child.material.thickness = settings.thickness
      child.material.emissive.copy(useColor)
      child.material.emissiveIntensity = settings.emissiveIntensity || 0
      child.material.iridescence = settings.iridescence || 0
      child.material.anisotropy = settings.anisotropy || 0
      child.material.needsUpdate = true
    })
    if (s.keyLight) {
      const i = settings.lightIntensity
      s.keyLight.intensity = 2 * i
      s.fillLight.intensity = 1 * i
      s.rimLight.intensity = 1.5 * i
      s.ambientLight.intensity = 0.4 * i
    }
    // Rebuild path tracer BVH when materials change
    if (s.pathTracer && s.ptEnabled) {
      try { s.pathTracer.setScene(s.scene, s.camera) } catch (_) {}
      s.ptNeedsReset = true
    }
  }, [settings.color, settings.roughness, settings.metalness, settings.clearcoat,
      settings.clearcoatRoughness, settings.transmission, settings.ior, settings.thickness,
      settings.lightIntensity, settings.emissiveIntensity, settings.iridescence, settings.anisotropy,
      settings.useSvgColors])

  // Reactive: geometry rebuild
  useEffect(() => {
    const s = stateRef.current
    if (!s.meshGroup || !svgData) return

    // Build first — don't touch existing mesh until we know it succeeds
    let result
    try { result = buildMeshGroup(svgData, settings) } catch (_) { result = null }
    if (!result) return  // Keep existing mesh intact, no black screen

    // Success — now safe to dispose old geometry and swap in the new
    while (s.meshGroup.children.length) {
      const c = s.meshGroup.children[0]
      c.geometry.dispose(); c.material.dispose(); s.meshGroup.remove(c)
    }
    const { group: newGroup, triangles } = result
    newGroup.children.forEach((c) => s.meshGroup.add(c.clone()))
    const box = new THREE.Box3().setFromObject(s.meshGroup)
    s.meshGroup.position.sub(box.getCenter(new THREE.Vector3()))
    if (s.ground) s.ground.position.y = box.min.y - 1
    setTriCount(triangles)
    if (s.pathTracer && s.ptEnabled) {
      try { s.pathTracer.setScene(s.scene, s.camera) } catch (_) {}
      s.ptNeedsReset = true
    }
  }, [settings.extrusionDepth, settings.bevelSize, settings.bevelThickness, settings.bevelSegments, svgData])

  // Reactive: background
  useEffect(() => {
    const s = stateRef.current
    const container = containerRef.current
    if (!s.renderer || !container) return
    const isTransparent = applyBackground(s.scene, s.renderer, settings.background, container, settings.customBgColor, s.hdrTexture)
    s.bgTransparent = isTransparent
  }, [settings.background, settings.customBgColor])

  // Reactive: bloom
  useEffect(() => {
    const s = stateRef.current
    if (s.bloomPass) s.bloomPass.strength = settings.bloomIntensity
  }, [settings.bloomIntensity])

  // Reactive: ground
  useEffect(() => {
    const s = stateRef.current
    if (!s.ground) return
    s.ground.visible = settings.showGround
    s.ground.material.opacity = settings.groundOpacity
  }, [settings.showGround, settings.groundOpacity])

  // Reactive: depth of field
  useEffect(() => {
    const s = stateRef.current
    if (!s.bokehPass) return
    s.bokehPass.enabled = settings.dofEnabled
    if (settings.dofEnabled) {
      s.bokehPass.uniforms['maxblur'].value = settings.dofBlur * 0.02
      s.bokehPass.uniforms['focus'].value = s.camera?.position.length() ?? s.maxDim * 2.2
    }
  }, [settings.dofEnabled, settings.dofBlur])

  // Reactive: path tracer toggle
  useEffect(() => {
    const s = stateRef.current
    s.ptEnabled = settings.usePathTracer
    if (settings.usePathTracer) {
      s.ptNeedsReset = true
      s.ptSamples = 0
    }
    if (ptCountRef.current) {
      ptCountRef.current.style.display = settings.usePathTracer ? 'block' : 'none'
    }
  }, [settings.usePathTracer])

  // Animation loop — reads stateRef.current fresh every frame so new scenes
  // created by setupScene are picked up immediately without restarting the loop.
  useEffect(() => {
    if (!stateRef.current.renderer) return
    let animId
    let lastTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const s = stateRef.current          // ← fresh ref every frame
      if (!s.renderer) return             // scene being rebuilt, skip frame

      const now = performance.now()
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      if (settings.usePathTracer && s.pathTracer) {
        // ── Path traced branch ────────────────────────────────────────────────
        if (s.ptNeedsReset) {
          s.pathTracer.reset()
          s.ptNeedsReset = false
          s.ptSamples = 0
        }
        s.controls.update()
        s.pathTracer.renderSample()
        s.ptSamples++
        if (ptCountRef.current) {
          ptCountRef.current.textContent = `PT · ${s.ptSamples} spp`
        }
      } else {
        // ── Rasterization branch ──────────────────────────────────────────────
        const speed = settings.animationSpeed ?? 1
        if (!s.paused) {
          s.animTime = (s.animTime || 0) + delta
          if (s.meshGroup) {
            const t = s.animTime
            s.meshGroup.rotation.y += settings.rotationSpeed * delta
            switch (settings.animationPreset) {
              case 'spin':
                s.meshGroup.rotation.y += 1.2 * speed * delta
                break
              case 'float':
                s.meshGroup.position.y = Math.sin(t * 1.2 * speed) * 5
                s.meshGroup.rotation.x = Math.sin(t * 0.6 * speed) * 0.06
                break
              case 'wobble':
                s.meshGroup.rotation.x = Math.sin(t * 2.5 * speed) * 0.18
                s.meshGroup.rotation.z = Math.cos(t * 1.8 * speed) * 0.12
                break
              case 'pulse': {
                const sc = 1 + Math.sin(t * 2.5 * speed) * 0.06
                const sy = Math.sign(s.meshGroup.scale.y)
                s.meshGroup.scale.set(sc, sc * sy, sc)
                break
              }
              case 'orbit':
                s.meshGroup.rotation.y += 0.6 * speed * delta
                s.meshGroup.rotation.x = Math.sin(t * 0.4 * speed) * 0.3
                break
            }
          }
        }

        // Camera preset tween
        if (s.targetCamPos) {
          s.camera.position.lerp(s.targetCamPos, 0.08)
          if (s.camera.position.distanceTo(s.targetCamPos) < 0.5) {
            s.camera.position.copy(s.targetCamPos)
            s.targetCamPos = null
          }
        }

        s.controls.update()
        if (s.bgTransparent) {
          s.renderer.render(s.scene, s.camera)
        } else {
          s.composer.render()
        }
      }
    }

    animate()
    return () => cancelAnimationFrame(animId)
  }, [settings.rotationSpeed, settings.animationPreset, settings.animationSpeed, settings.usePathTracer])

  // Resize
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
      s.composer?.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const s = stateRef.current
      if (!s.camera) return
      if (e.key === 'r' || e.key === 'R') {
        s.controls.reset()
      } else if (e.key === ' ') {
        e.preventDefault()
        s.paused = !s.paused
      } else if (e.key === 's' || e.key === 'S') {
        if (s.bgTransparent) s.renderer.render(s.scene, s.camera)
        else s.composer.render()
        const a = document.createElement('a')
        a.href = s.renderer.domElement.toDataURL('image/png')
        a.download = 'screenshot.png'
        a.click()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Camera preset event
  useEffect(() => {
    const handle = (e) => {
      const s = stateRef.current
      if (!s.camera) return
      const dist = s.camera.position.length() || s.maxDim * 2.2
      const dir = new THREE.Vector3(...e.detail.dir).normalize()
      s.targetCamPos = dir.multiplyScalar(dist)
    }
    window.addEventListener('set-camera-preset', handle)
    return () => window.removeEventListener('set-camera-preset', handle)
  }, [])

  // PNG export event
  useEffect(() => {
    const handle = (e) => {
      const s = stateRef.current
      if (!s.renderer) return
      const { width, height } = e.detail || { width: 1920, height: 1080 }
      const origW = s.renderer.domElement.width
      const origH = s.renderer.domElement.height
      const origAspect = s.camera.aspect

      s.renderer.setSize(width, height, false)
      s.composer?.setSize(width, height)
      s.camera.aspect = width / height
      s.camera.updateProjectionMatrix()

      if (s.bgTransparent) s.renderer.render(s.scene, s.camera)
      else s.composer.render()

      const a = document.createElement('a')
      a.href = s.renderer.domElement.toDataURL('image/png')
      a.download = `render-${width}x${height}.png`
      a.click()

      s.renderer.setSize(origW, origH, false)
      s.composer?.setSize(origW, origH)
      s.camera.aspect = origAspect
      s.camera.updateProjectionMatrix()
    }
    window.addEventListener('export-png', handle)
    return () => window.removeEventListener('export-png', handle)
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
    const onDone = (blob, filename) => { downloadBlob(blob, filename); setExporting(false) }

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%', height: '100%',
          ...(bgOpt?.transparent
            ? { backgroundImage: 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%)', backgroundSize: '20px 20px' }
            : {}),
        }}
      />

      {/* Error overlay — shown when SVG upload fails */}
      {uploadError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}>
          <div style={{
            background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,80,80,0.25)',
            borderRadius: 18, padding: '28px 36px', maxWidth: 340, textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.8 }}>⚠</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 8, lineHeight: 1.5 }}>
              {uploadError}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>
              Upload a different SVG to continue
            </div>
          </div>
        </div>
      )}

      {/* Triangle count */}
      {triCount > 0 && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          fontSize: 10, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.18)',
          pointerEvents: 'none', letterSpacing: '0.05em',
        }}>
          {triCount.toLocaleString()} tri
        </div>
      )}

      {/* Path tracer sample counter */}
      <div ref={ptCountRef} style={{
        display: 'none',
        position: 'absolute', bottom: 12, right: 12,
        fontSize: 10, fontFamily: 'monospace',
        color: 'rgba(255,255,255,0.5)',
        pointerEvents: 'none', letterSpacing: '0.05em',
        background: 'rgba(0,0,0,0.35)', padding: '3px 9px', borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.08)',
      }} />
    </div>
  )
}
