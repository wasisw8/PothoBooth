import * as fs from 'fs'

const file = 'src/app/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

content = content.replace(
  "const filteredTemplates = templates.filter(t =>",
  "const filteredTemplates = templates.filter(t => \n    (t.mode === mode || (!t.mode && mode === 'single')) &&"
)

fs.writeFileSync(file, content)
