sed -i '' "s/mode: 'single' | 'strip'/mode: 'single' | 'strip' | 'grid6'\n  retakeSlot?: number | null/" src/components/booth/CameraView.tsx

sed -i '' 's/export function CameraView({ templateUrl, filter, onCapture, mode }: CameraViewProps) {/export function CameraView({ templateUrl, filter, onCapture, mode, retakeSlot }: CameraViewProps) {/' src/components/booth/CameraView.tsx

# Replace capturePhoto body
cat << 'INNER_EOF' > capturePhoto.ts
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
INNER_EOF

# Find start and end line of capturePhoto
START_LINE=$(grep -n "const capturePhoto = useCallback" src/components/booth/CameraView.tsx | cut -d: -f1)
END_LINE=$(grep -n "}, \[mirrored, currentFilter, templateImage, mode, stripPhotos, onCapture\])" src/components/booth/CameraView.tsx | cut -d: -f1)

# Delete the old function and insert the new one
sed -i '' "${START_LINE},${END_LINE}d" src/components/booth/CameraView.tsx
sed -i '' "${START_LINE}r capturePhoto.ts" src/components/booth/CameraView.tsx

