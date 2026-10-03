import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [totalUsers, totalTransactions, todayRevenue, monthRevenue, recentTransactions] =
    await Promise.all([
      prisma.user.count(),
      prisma.transaction.count({ where: { status: "PAID" } }),
      prisma.transaction.aggregate({
        where: { status: "PAID", paidAt: { gte: today } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { status: "PAID", paidAt: { gte: thisMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { status: "PAID" },
        include: { user: { select: { name: true, email: true, image: true } } },
        orderBy: { paidAt: "desc" },
        take: 10,
      }),
    ])

  return Response.json({
    stats: {
      totalUsers,
      totalTransactions,
      todayRevenue: todayRevenue._sum.amount || 0,
      monthRevenue: monthRevenue._sum.amount || 0,
    },
    recentTransactions,
  })
}
