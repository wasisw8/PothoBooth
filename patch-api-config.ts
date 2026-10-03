import * as fs from 'fs'

const file = 'src/app/api/admin/templates/route.ts'
let content = fs.readFileSync(file, 'utf8')

// Add to POST
content = content.replace(
  'const mode = (formData.get("mode") as string) || "single"',
  'const mode = (formData.get("mode") as string) || "single"\n  const config = formData.get("config") as string | null'
)
content = content.replace(
  'mode,',
  'mode,\n        config,'
)

// Add to PUT
content = content.replace(
  'const mode = (formData.get("mode") as string) || "single"',
  'const mode = (formData.get("mode") as string) || "single"\n  const config = formData.get("config") as string | null'
)
content = content.replace(
  'const dataToUpdate: any = { name, category, mode }',
  'const dataToUpdate: any = { name, category, mode }\n    if (config !== null) dataToUpdate.config = config'
)

fs.writeFileSync(file, content)
