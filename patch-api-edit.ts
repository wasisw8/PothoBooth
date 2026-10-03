import * as fs from 'fs'

const file = 'src/app/api/admin/templates/route.ts'
let content = fs.readFileSync(file, 'utf8')

const putLogic = `
// PUT: Edit existing template
export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await request.formData()
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const mode = (formData.get("mode") as string) || "single"

  if (!id || !name || !category) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  const file = formData.get("file") as File | null
  const thumbnailFile = formData.get("thumbnail") as File | null

  try {
    const templatesDir = path.join(process.cwd(), "public", "templates")
    
    let imageUrl = undefined
    if (file && file.size > 0) {
      await mkdir(templatesDir, { recursive: true })
      const ext = file.name.split(".").pop() || "png"
      const filename = \`template_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${ext}\`
      const filepath = path.join(templatesDir, filename)
      const bytes = await file.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))
      imageUrl = \`/templates/\${filename}\`
    }

    let thumbnailUrl = undefined
    if (thumbnailFile && thumbnailFile.size > 0) {
      await mkdir(templatesDir, { recursive: true })
      const thumbExt = thumbnailFile.name.split(".").pop() || "png"
      const thumbName = \`thumb_\${Date.now()}_\${Math.random().toString(36).substring(2, 8)}.\${thumbExt}\`
      const thumbPath = path.join(templatesDir, thumbName)
      const thumbBytes = await thumbnailFile.arrayBuffer()
      await writeFile(thumbPath, Buffer.from(thumbBytes))
      thumbnailUrl = \`/templates/\${thumbName}\`
    }

    const dataToUpdate: any = { name, category, mode }
    if (imageUrl) dataToUpdate.imageUrl = imageUrl
    if (thumbnailUrl) dataToUpdate.thumbnailUrl = thumbnailUrl
    // If main image updated but no thumb provided, we might want to update thumb too, but let's keep it simple

    const template = await prisma.template.update({
      where: { id },
      data: dataToUpdate,
    })

    return Response.json({ template }, { status: 200 })
  } catch (error) {
    console.error("Template update error:", error)
    return Response.json({ error: "Update failed" }, { status: 500 })
  }
}
`

if (!content.includes('export async function PUT')) {
  content += '\n' + putLogic
  fs.writeFileSync(file, content)
}
