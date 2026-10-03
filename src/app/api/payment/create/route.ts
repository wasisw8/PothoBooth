import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createQrisTransaction, PACKAGES, type PackageKey } from "@/lib/klikqris"
import { generateOrderId } from "@/lib/utils"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  let { packageKey } = body as { packageKey: string }
  packageKey = packageKey?.toUpperCase() || ""

  if (!packageKey || !PACKAGES[packageKey as PackageKey]) {
    return Response.json({ error: "Paket tidak valid" }, { status: 400 })
  }

  const pkg = PACKAGES[packageKey as PackageKey]
  const orderId = generateOrderId()

  try {
    // --- BYPASS MODE ---
    // Create transaction in database as PAID immediately
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days active for testing

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        orderId,
        package: packageKey,
        amount: pkg.price,
        totalAmount: pkg.price,
        status: "PAID",
        paidAt: new Date(),
        expiresAt: expiresAt,
      },
    })

    return Response.json({
      success: true,
      bypassed: true,
      data: {
        transactionId: transaction.id,
        orderId,
        package: pkg,
      },
    })
    // --- END BYPASS MODE ---
  } catch (error) {
    console.error("Payment creation error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
