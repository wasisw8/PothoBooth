import * as fs from 'fs'

const file = 'prisma/schema.prisma'
let content = fs.readFileSync(file, 'utf8')

if (!content.includes('mode        String')) {
  content = content.replace(
    'category    String',
    'category    String\n  mode        String   @default("single")'
  )
  fs.writeFileSync(file, content)
}
