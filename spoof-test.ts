import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function run() {
  const user = await prisma.user.findFirst()
  if (!user) return
  // Create a fake session
  const session = await prisma.session.create({
    data: {
      sessionToken: "super-secret-token",
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60)
    }
  })
  
  // Hit the payment API
  const res = await fetch('http://localhost:3000/api/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'authjs.session-token=super-secret-token'
    },
    body: JSON.stringify({ packageKey: 'CERIA' })
  })
  
  console.log("Status:", res.status)
  console.log("Body:", await res.text())
}
run()
