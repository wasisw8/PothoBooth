import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// POST: Save a captured photo
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { imageData, transactionId, templateId, filter, mode } = body

  if (!imageData || !transactionId) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  // Verify transaction belongs to user and is active
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: session.user.id,
      status: "PAID",
    },
  })

  if (!transaction) {
    return Response.json({ error: "Invalid or expired session" }, { status: 403 })
  }

  // Check if session is still active
  if (transaction.expiresAt && new Date() > transaction.expiresAt) {
    return Response.json({ error: "Session expired" }, { status: 403 })
  }

  try {
    // Save image to disk
    const uploadsDir = path.join(process.cwd(), "public", "uploads", session.user.id)
    await mkdir(uploadsDir, { recursive: true })

    const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`
    const filepath = path.join(uploadsDir, filename)

    // Remove data URL prefix and save
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")
    await writeFile(filepath, buffer)

    const imageUrl = `/uploads/${session.user.id}/${filename}`

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        transactionId,
        templateId: templateId || null,
        imageUrl,
        filter: filter || null,
        mode: mode || "single",
      },
    })

    return Response.json({ photo }, { status: 201 })
  } catch (error) {
    console.error("Photo save error:", error)
    return Response.json({ error: "Failed to save photo" }, { status: 500 })
  }
}

// GET: List user's photos
export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20
  const skip = (page - 1) * limit

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where: { userId: session.user.id },
      include: { template: true, transaction: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.photo.count({ where: { userId: session.user.id } }),
  ])

  return Response.json({
    photos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
