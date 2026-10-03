import * as fs from 'fs'

const file = 'src/app/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Fix Template interface
content = content.replace(
  'previewUrl: string',
  'previewUrl: string\n  imageUrl?: string\n  thumbnailUrl?: string | null\n  mode?: string'
)

fs.writeFileSync(file, content)
