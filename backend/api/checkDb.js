const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users.length);
  console.log(users);
}
checkDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
