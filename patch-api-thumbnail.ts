import * as fs from 'fs'

const file = 'src/app/api/admin/templates/route.ts'
let content = fs.readFileSync(file, 'utf8')

// Add mode and thumbnail to extraction
content = content.replace(
  'const category = formData.get("category") as string',
  `const category = formData.get("category") as string\n  const mode = (formData.get("mode") as string) || "single"\n  const thumbnailFile = formData.get("thumbnail") as File | null`
)

// Add save logic for thumbnail
const saveLogic = `
    let thumbnailUrl = imageUrl
    if (thumbnailFile) {
      const thumbExt = thumbnailFile.name.split(".").pop() || "png"
      const thumbName = \`thumb_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${thumbExt}\`
      const thumbPath = path.join(templatesDir, thumbName)
      const thumbBytes = await thumbnailFile.arrayBuffer()
      await writeFile(thumbPath, Buffer.from(thumbBytes))
      thumbnailUrl = \`/templates/\${thumbName}\`
    }

    const template = await prisma.template.create({
`
content = content.replace(
  'const template = await prisma.template.create({',
  saveLogic
)

// Update thumbnailUrl in DB
content = content.replace(
  'thumbnailUrl: imageUrl,',
  'thumbnailUrl: thumbnailUrl,'
)

fs.writeFileSync(file, content)
