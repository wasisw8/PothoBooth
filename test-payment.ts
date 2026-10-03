import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  const user = await prisma.user.findFirst()
  if (!user) { console.log("No user found"); return; }
  
  const res = await fetch('http://localhost:3000/api/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': 'authjs.session-token=mock' },
    body: JSON.stringify({ packageKey: 'BASIC' })
  })
  console.log(res.status)
  console.log(await res.text())
}
test()
