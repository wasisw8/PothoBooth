import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function run() {
  await prisma.user.updateMany({
    where: { email: 'wasiswibowo07@gmail.com' },
    data: { role: 'ADMIN' }
  })
  console.log("Success! You are now an ADMIN.")
}
run()
