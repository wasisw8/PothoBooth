import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

// Replace the main wrapper
content = content.replace(
  '<div className="relative w-full max-w-2xl mx-auto">',
  '<div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-5xl mx-auto">\n      <div className="relative w-full max-w-2xl mx-auto">'
)

// Replace the controls wrapper
content = content.replace(
  '<div className="mt-6 flex justify-center gap-4">',
  '<div className="flex md:flex-col items-center justify-center gap-4 mt-2 md:mt-0">'
)

// Close the inner camera wrapper before controls
const controlsIndex = content.indexOf('<div className="flex md:flex-col')
content = content.slice(0, controlsIndex) + '</div>\n      ' + content.slice(controlsIndex)

fs.writeFileSync(file, content)
