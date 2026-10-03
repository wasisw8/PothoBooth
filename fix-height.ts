import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

// 1. Fix Live Preview Height
content = content.replace(
  "const height = '21.5%'",
  "const height = '23.4%'"
)

// 2. Fix Canvas Result boxHeight
content = content.replace(
  "const boxHeight = 220",
  "const boxHeight = 240"
)

// 3. Implement object-cover drawing
const oldDraw = "ctx.drawImage(img, x, y, boxWidth, boxHeight)"
const newDraw = `
        const imgAspect = img.width / img.height
        const boxAspect = boxWidth / boxHeight
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

        ctx.drawImage(img, sx, sy, drawWidth, drawHeight, x, y, boxWidth, boxHeight)
`
content = content.replace(oldDraw, newDraw)

fs.writeFileSync(file, content)
