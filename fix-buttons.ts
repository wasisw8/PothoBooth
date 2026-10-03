import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

content = content.replace(
  /className="p-4 bg-white\/20 hover:bg-white\/30 rounded-full backdrop-blur-md transition-all text-white border border-white\/30"/g,
  'className="p-4 bg-white hover:bg-pink-50 rounded-full shadow-sm transition-all text-gray-600 hover:text-primary border border-pink-100"'
)

content = content.replace(
  /className=\{`p-4 bg-white\/20 hover:bg-white\/30 rounded-full backdrop-blur-md transition-all text-white border border-white\/30 \${mirrored \? 'bg-primary' : ''}`\}/g,
  'className={`p-4 rounded-full shadow-sm transition-all border border-pink-100 ${mirrored ? "bg-primary text-white hover:bg-primary-dark" : "bg-white text-gray-600 hover:bg-pink-50 hover:text-primary"}`}'
)

fs.writeFileSync(file, content)
