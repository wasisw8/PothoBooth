import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

// 1. Update Live Preview (bleeding under template)
content = content.replace("const left = col === 0 ? '6.6%' : '52.1%'", "const left = col === 0 ? '5.8%' : '51.3%'")
content = content.replace("const top = row === 0 ? '9.3%' : row === 1 ? '33.7%' : '58.1%'", "const top = row === 0 ? '8.8%' : row === 1 ? '33.2%' : '57.6%'")
content = content.replace("const width = '41.1%'", "const width = '43.2%'")
content = content.replace("const height = '23.4%'", "const height = '25.4%'")

// 2. Update Canvas (bleeding under template)
content = content.replace("const colX = [45, 355]", "const colX = [40, 350]")
content = content.replace("const rowY = [95, 345, 595]", "const rowY = [90, 340, 590]")
content = content.replace("const boxWidth = 280", "const boxWidth = 295")
content = content.replace("const boxHeight = 240", "const boxHeight = 260")

fs.writeFileSync(file, content)
