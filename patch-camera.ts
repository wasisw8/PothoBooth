import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

// Update Props interface
content = content.replace(
  "retakeSlot?: number | null",
  "retakeSlot?: number | null\n  layoutConfig?: any"
)

// Update component signature
content = content.replace(
  "retakeSlot ",
  "retakeSlot,\n  layoutConfig "
)

// Define DEFAULT_BOXES inside CameraView
const defaultBoxes = `
  const defaultBoxes = [
    {x: 40, y: 90, w: 295, h: 260},
    {x: 350, y: 90, w: 295, h: 260},
    {x: 40, y: 340, w: 295, h: 260},
    {x: 350, y: 340, w: 295, h: 260},
    {x: 40, y: 590, w: 295, h: 260},
    {x: 350, y: 590, w: 295, h: 260}
  ]
  const boxes = layoutConfig?.boxes || defaultBoxes
`
content = content.replace(
  "const [mirrored, setMirrored] = useState(true)",
  defaultBoxes.trim() + "\n  const [mirrored, setMirrored] = useState(true)"
)

// Replace createGrid6Photo coordinates
content = content.replace(
  "const boxWidth = 295",
  "// const boxWidth = 295"
)
content = content.replace(
  "const boxHeight = 260",
  "// const boxHeight = 260"
)
content = content.replace(
  "const colX = [40, 350]",
  "// const colX = [40, 350]"
)
content = content.replace(
  "const rowY = [90, 340, 590]",
  "// const rowY = [90, 340, 590]"
)

// Update drawing loop
const newDrawLoop = `
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
`
content = content.replace(
  /let loaded = 0\n\s*photos\.forEach\(\(photoData, index\) => \{[\s\S]*?ctx\.drawImage\(img, sx, sy, drawWidth, drawHeight, x, y, boxWidth, boxHeight\)/,
  newDrawLoop.trim()
)

// Update Live Preview dimensions
content = content.replace(
  "const left = col === 0 ? '5.8%' : '51.3%'",
  "const left = `${(boxes[index]?.x || 0) / 682 * 100}%`"
)
content = content.replace(
  "const top = row === 0 ? '8.8%' : row === 1 ? '33.2%' : '57.6%'",
  "const top = `${(boxes[index]?.y || 0) / 1024 * 100}%`"
)
content = content.replace(
  "const width = '43.2%'",
  "const width = `${(boxes[index]?.w || 295) / 682 * 100}%`"
)
content = content.replace(
  "const height = '25.4%'",
  "const height = `${(boxes[index]?.h || 260) / 1024 * 100}%`"
)

fs.writeFileSync(file, content)
