const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedUser() {
  const email = 'admin@recruitos.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email,
        passwordHash,
        role: 'ADMIN'
      }
    });
    console.log(`User created: ${email} / ${password}`);
  } else {
    console.log(`User already exists: ${email}`);
  }
}

seedUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
