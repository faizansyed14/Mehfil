import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`Admin already exists (${ADMIN_EMAIL}); skipping — no changes made.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'Mehfil Admin',
      passwordHash,
      role: 'ADMIN',
      bio: 'The curator of this gathering.',
    },
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
