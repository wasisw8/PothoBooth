import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: List templates (public)
export async function GET() {
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ templates })
}

// POST: Create template (admin only)
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

  const body = await request.json()
  const { name, category, imageUrl, thumbnailUrl } = body

  if (!name || !category || !imageUrl) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  const template = await prisma.template.create({
    data: {
      name,
      category,
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
    },
  })

  return Response.json({ template }, { status: 201 })
}
