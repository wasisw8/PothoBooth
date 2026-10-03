'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Camera, RotateCcw, FlipHorizontal, Download, ArrowLeft, Palette, Image as ImageIcon, SlidersHorizontal } from 'lucide-react'

interface CameraViewProps {
  templateUrl: string | null
  filter: string | null
  onCapture: (imageData: string) => void
  mode: 'single' | 'strip' | 'grid6'
  retakeSlot?: number | null
  layoutConfig?: any
}

const FILTERS = [
  { id: null, name: 'Normal', css: '' },
  { id: 'bw', name: 'B&W', css: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(90%) brightness(90%)' },
  { id: 'warm', name: 'Warm', css: 'sepia(30%) saturate(140%) brightness(105%)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(30deg) saturate(80%)' },
  { id: 'vivid', name: 'Vivid', css: 'saturate(180%) contrast(110%)' },
  { id: 'fade', name: 'Fade', css: 'contrast(80%) brightness(110%) saturate(70%)' },
]

export function CameraView({ templateUrl, filter, onCapture, mode, retakeSlot,
  layoutConfig }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const defaultBoxes = [
    {x: 40, y: 90, w: 295, h: 260},
    {x: 350, y: 90, w: 295, h: 260},
    {x: 40, y: 340, w: 295, h: 260},
    {x: 350, y: 340, w: 295, h: 260},
    {x: 40, y: 590, w: 295, h: 260},
    {x: 350, y: 590, w: 295, h: 260}
  ]
  const boxes = layoutConfig?.boxes || defaultBoxes
  const [mirrored, setMirrored] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showFlash, setShowFlash] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null)
  const [stripPhotos, setStripPhotos] = useState<string[]>([])

  // Load template image
  useEffect(() => {
    if (templateUrl) {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => setTemplateImage(img)
      img.src = templateUrl
    } else {
      setTemplateImage(null)
    }
  }, [templateUrl])

  const currentFilter = FILTERS.find(f => f.id === filter)?.css || ''


  const capturePhoto = useCallback(() => {
    const webcam = webcamRef.current
    const canvas = canvasRef.current
    if (!webcam || !canvas) return

    const video = webcam.video
    if (!video) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 640
    canvas.height = 480
    ctx.filter = currentFilter || 'none'
    if (mirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.filter = 'none'

    if (templateImage && mode === 'single') {
      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height)
    }

    const imageData = canvas.toDataURL('image/png')

    if (mode === 'strip') {
      const newPhotos = [...stripPhotos, imageData]
      setStripPhotos(newPhotos)
      if (newPhotos.length >= 4) {
        createPhotoStrip(newPhotos)
      }
    } else if (mode === 'grid6') {
      if (retakeSlot !== undefined && retakeSlot !== null) {
        const newPhotos = [...stripPhotos]
        newPhotos[retakeSlot] = imageData
        setStripPhotos(newPhotos)
        createGrid6Photo(newPhotos)
      } else {
        const newPhotos = [...stripPhotos, imageData]
        setStripPhotos(newPhotos)
        if (newPhotos.length >= 6) {
          createGrid6Photo(newPhotos)
        }
      }
    } else {
      onCapture(imageData)
    }
  }, [mirrored, currentFilter, templateImage, mode, stripPhotos, onCapture, retakeSlot])
  const createGrid6Photo = useCallback((photos: string[]) => {
    const finalCanvas = document.createElement('canvas')
    const ctx = finalCanvas.getContext('2d')
    if (!ctx) return

    // Template dimensions
    finalCanvas.width = 682
    finalCanvas.height = 1024

    // Background (just in case there are transparent gaps outside the template)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

    // Layout configuration (estimated from the template)
    // const boxWidth = 295
    // const boxHeight = 260
    // const colX = [40, 350]
    // const rowY = [90, 340, 590]

    let loaded = 0
    photos.forEach((photoData, index) => {
      const box = boxes[index]
      const x = box.x
      const y = box.y
      const boxW = box.w
      const boxH = box.h

      const img = new Image()
      img.onload = () => {
        const imgAspect = img.width / img.height
        const boxAspect = boxW / boxH
        let drawWidth = img.width
        let drawHeight = img.height
        let sx = 0
        let sy = 0

        if (imgAspect > boxAspect) {
          drawWidth = img.height * boxAspect
          sx = (img.width - drawWidth) / 2
        } else {
          drawHeight = img.width / boxAspect
          sy = (img.height - drawHeight) / 2
        }

        ctx.drawImage(img, sx, sy, drawWidth, drawHeight, x, y, boxW, boxH)

        
        loaded++
        if (loaded === 6) {
          // Once all 6 photos are drawn, draw the template overlay ON TOP
          if (templateImage) {
            ctx.drawImage(templateImage, 0, 0, finalCanvas.width, finalCanvas.height)
          }
          
          // Send final image to parent
          onCapture(finalCanvas.toDataURL('image/png'))
        }
      }
      img.src = photoData
    })
  }, [templateImage, onCapture])

  const createPhotoStrip = useCallback((photos: string[]) => {
    const stripCanvas = document.createElement('canvas')
    const ctx = stripCanvas.getContext('2d')
    if (!ctx) return

    const photoWidth = 640
    const photoHeight = 480
    const padding = 20
    const borderRadius = 0

    stripCanvas.width = photoWidth + padding * 2
    stripCanvas.height = (photoHeight * 4) + (padding * 5) + 80 // extra for branding

    // Background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)

    // Decorative top bar
    const gradient = ctx.createLinearGradient(0, 0, stripCanvas.width, 0)
    gradient.addColorStop(0, '#FF6B9D')
    gradient.addColorStop(0.5, '#C084FC')
    gradient.addColorStop(1, '#FCD34D')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, stripCanvas.width, 8)

    // Draw photos
    let loaded = 0
    photos.forEach((photoData, index) => {
      const img = new window.Image()
      img.onload = () => {
        const y = padding + (photoHeight + padding) * index + 8
        ctx.drawImage(img, padding, y, photoWidth, photoHeight)
        loaded++
        if (loaded === photos.length) {
          // Add branding at bottom
          const brandY = stripCanvas.height - 60
          ctx.fillStyle = '#FF6B9D'
          ctx.font = 'bold 24px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('📸 PothoBooth', stripCanvas.width / 2, brandY + 20)
          ctx.fillStyle = '#999'
          ctx.font = '14px sans-serif'
          ctx.fillText(new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }), stripCanvas.width / 2, brandY + 45)

          // Bottom gradient bar
          ctx.fillStyle = gradient
          ctx.fillRect(0, stripCanvas.height - 8, stripCanvas.width, 8)

          onCapture(stripCanvas.toDataURL('image/png'))
        }
      }
      img.src = photoData
    })
  }, [onCapture])

  const startCountdown = useCallback(() => {
    setCountdown(3)
  }, [])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      setShowFlash(true)
      capturePhoto()
      setTimeout(() => setShowFlash(false), 300)
      setCountdown(null)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, capturePhoto])

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-5xl mx-auto">
      <div className="relative w-full max-w-2xl mx-auto">

      {mode === 'grid6' ? (
        <div className="relative w-full max-w-md mx-auto aspect-[682/1024] bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Slots */}
          {[0, 1, 2, 3, 4, 5].map(index => {
            const col = index % 2
            const row = Math.floor(index / 2)
            const left = `${(boxes[index]?.x || 0) / 682 * 100}%`
            const top = `${(boxes[index]?.y || 0) / 1024 * 100}%`
            const width = `${(boxes[index]?.w || 295) / 682 * 100}%`
            const height = `${(boxes[index]?.h || 260) / 1024 * 100}%`
            
            const isCurrent = retakeSlot !== null && retakeSlot !== undefined 
              ? retakeSlot === index 
              : stripPhotos.length === index

            return (
              <div 
                key={index}
                className="absolute bg-gray-100 overflow-hidden"
                style={{ left, top, width, height }}
              >
                {stripPhotos[index] && !isCurrent ? (
                  <img src={stripPhotos[index]} className="w-full h-full object-cover" />
                ) : isCurrent ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={mirrored}
                    videoConstraints={{ facingMode, width: 640, height: 480 }}
                    className={`w-full h-full object-cover ${currentFilter}`}
                  />
                ) : null}
              </div>
            )
          })}

          {/* Template Overlay */}
          {templateUrl && (
            <img
              src={templateUrl}
              alt="Template overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
            />
          )}

          {/* Flash & Countdown for Grid6 */}
          {showFlash && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-30" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40">
              <span className="text-white text-9xl font-black animate-countdown drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={mirrored}
            videoConstraints={{ facingMode, width: 640, height: 480 }}
            className={`w-full h-auto block ${currentFilter}`}
          />
          {templateUrl && mode === 'single' && (
            <img
              src={templateUrl}
              alt="Template overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          )}
          {showFlash && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-20" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-30">
              <span className="text-white text-9xl font-black animate-countdown drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
          {mode === 'strip' && (
            <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-bold text-sm z-10 shadow-md">
              📸 {stripPhotos.length} / 4
            </div>
          )}
        </div>
      )}

      

      </div>
      <div className="flex md:flex-col items-center justify-center gap-4 mt-2 md:mt-0">
        <button
          onClick={switchCamera}
          className="p-4 bg-white hover:bg-pink-50 rounded-full shadow-sm transition-all text-gray-600 hover:text-primary border border-pink-100"
          title="Tukar Kamera"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMirrored(!mirrored)}
          className={`p-4 rounded-full shadow-sm transition-all border border-pink-100 ${mirrored ? "bg-primary text-white hover:bg-primary-dark" : "bg-white text-gray-600 hover:bg-pink-50 hover:text-primary"}`}
          title="Balikkan Gambar (Mirror)"
        >
          <FlipHorizontal className="w-6 h-6" />
        </button>
        <button
          onClick={startCountdown}
          disabled={countdown !== null}
          className="p-4 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg rounded-full backdrop-blur-md transition-all text-white border-2 border-white disabled:opacity-50"
          title="Ambil Foto"
        >
          <Camera className="w-8 h-8" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}