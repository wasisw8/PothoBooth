import * as fs from 'fs'

const file = 'src/app/api/admin/templates/route.ts'
let content = fs.readFileSync(file, 'utf8')

// Add mode to extraction
content = content.replace(
  "const category = formData.get('category') as string",
  "const category = formData.get('category') as string\n    const mode = (formData.get('mode') as string) || 'single'"
)

// Add mode to create
content = content.replace(
  "category,",
  "category,\n        mode,"
)

fs.writeFileSync(file, content)
