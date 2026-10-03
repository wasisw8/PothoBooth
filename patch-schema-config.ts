import * as fs from 'fs'

const file = 'prisma/schema.prisma'
let content = fs.readFileSync(file, 'utf8')

if (!content.includes('config      String?')) {
  content = content.replace(
    'mode        String   @default("single")',
    'mode        String   @default("single")\n  config      String?'
  )
  fs.writeFileSync(file, content)
}
