import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// GET: List all templates for admin
export async function GET() {
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

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ templates })
}

// POST: Upload new template
export async function POST(request: Request) {
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
  const file = formData.get("file") as File | null
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const mode = (formData.get("mode") as string) || "single"
  const config = formData.get("config") as string | null


  const thumbnailFile = formData.get("thumbnail") as File | null

  if (!file || !name || !category) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: "File type not allowed. Use PNG, SVG, JPEG, or WebP." }, { status: 400 })
  }

  try {
    const templatesDir = path.join(process.cwd(), "public", "templates")
    await mkdir(templatesDir, { recursive: true })

    const ext = file.name.split(".").pop() || "png"
    const filename = `template_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
    const filepath = path.join(templatesDir, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    const imageUrl = `/templates/${filename}`

    
    let thumbnailUrl = imageUrl
    if (thumbnailFile) {
      const thumbExt = thumbnailFile.name.split(".").pop() || "png"
      const thumbName = `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${thumbExt}`
      const thumbPath = path.join(templatesDir, thumbName)
      const thumbBytes = await thumbnailFile.arrayBuffer()
      await writeFile(thumbPath, Buffer.from(thumbBytes))
      thumbnailUrl = `/templates/${thumbName}`
    }

    const template = await prisma.template.create({

      data: {
        name,
        category,
        mode,
        config,
        imageUrl,
        thumbnailUrl: thumbnailUrl,
      },
    })

    return Response.json({ template }, { status: 201 })
  } catch (error) {
    console.error("Template upload error:", error)
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}

// PATCH: Toggle template active status
export async function PATCH(request: Request) {
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

  const body = await request.json()
  const { id, isActive } = body

  const template = await prisma.template.update({
    where: { id },
    data: { isActive },
  })

  return Response.json({ template })
}

// DELETE: Remove template
export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return Response.json({ error: "Missing template ID" }, { status: 400 })
  }

  await prisma.template.delete({ where: { id } })

  return Response.json({ message: "Deleted" })
}


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
  const config = formData.get("config") as string | null

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
      const filename = `template_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
      const filepath = path.join(templatesDir, filename)
      const bytes = await file.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))
      imageUrl = `/templates/${filename}`
    }

    let thumbnailUrl = undefined
    if (thumbnailFile && thumbnailFile.size > 0) {
      await mkdir(templatesDir, { recursive: true })
      const thumbExt = thumbnailFile.name.split(".").pop() || "png"
      const thumbName = `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${thumbExt}`
      const thumbPath = path.join(templatesDir, thumbName)
      const thumbBytes = await thumbnailFile.arrayBuffer()
      await writeFile(thumbPath, Buffer.from(thumbBytes))
      thumbnailUrl = `/templates/${thumbName}`
    }

    const dataToUpdate: any = { name, category, mode }
    if (typeof config !== "undefined") dataToUpdate.config = config
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
