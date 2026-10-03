import * as fs from 'fs'

const file = 'src/app/booth/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Add layoutConfig extraction
content = content.replace(
  "const [countdown, setCountdown] = useState<number | null>(null)",
  "const [countdown, setCountdown] = useState<number | null>(null)\n  const layoutConfig = template?.config ? JSON.parse(template.config) : null"
)

// Pass layoutConfig to CameraView
content = content.replace(
  "retakeSlot={retakeSlot}",
  "retakeSlot={retakeSlot}\n            layoutConfig={layoutConfig}"
)

fs.writeFileSync(file, content)
