import * as fs from 'fs'

const file = 'src/components/booth/CameraView.tsx'
let content = fs.readFileSync(file, 'utf8')

content = content.replace(
  /className=\{`w-full h-full object-cover \$\{currentFilter\} \$\{mirrored \? 'scale-x-\[-1\]' : ''\}`\}/g,
  'className={`w-full h-full object-cover ${currentFilter}`}'
)

content = content.replace(
  /className=\{`w-full h-auto block \$\{currentFilter\} \$\{mirrored \? 'scale-x-\[-1\]' : ''\}`\}/g,
  'className={`w-full h-auto block ${currentFilter}`}'
)

fs.writeFileSync(file, content)
