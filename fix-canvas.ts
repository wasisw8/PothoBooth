import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

if (!content.includes('<canvas ref={canvasRef}')) {
  content = content.replace(
    /    <\/div>\n  \)\n}\n?$/,
    '      <canvas ref={canvasRef} className="hidden" />\n    </div>\n  )\n}'
  )
  fs.writeFileSync(file, content)
}
