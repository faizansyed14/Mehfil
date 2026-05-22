import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const userPassword = await bcrypt.hash('Password123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
      displayName: 'Mehfil Admin',
    },
    create: {
      email: 'admin@gmail.com',
      username: 'admin',
      displayName: 'Mehfil Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      bio: 'The curator of this gathering.',
    },
  });

  // Sample users
  const poets = [
    {
      email: 'poet1@mehfil.local',
      username: 'keats_scribe',
      displayName: 'John Keats',
      bio: 'A thing of beauty is a joy for ever.',
    },
    {
      email: 'poet2@mehfil.local',
      username: 'plath_verse',
      displayName: 'Sylvia Plath',
      bio: 'I took a deep breath and listened to the old brag of my heart.',
    },
    {
      email: 'poet3@mehfil.local',
      username: 'rumi_echo',
      displayName: 'Rumi',
      bio: 'Let the beauty of what you love be what you do.',
    },
  ];

  for (const poet of poets) {
    const user = await prisma.user.upsert({
      where: { email: poet.email },
      update: {},
      create: {
        ...poet,
        passwordHash: userPassword,
      },
    });

    const postCount = await prisma.post.count({ where: { authorId: user.id } });
    if (postCount > 0) continue;

    await prisma.post.create({
      data: {
        authorId: user.id,
        title: `A Poem by ${poet.displayName}`,
        body: `This is a beautiful poem about nature and the soul.\n\nLines of verse that echo through time,\nCapturing moments rhythm and rhyme.`,
        tags: ['poetry', 'nature'],
      },
    });

    await prisma.post.create({
      data: {
        authorId: user.id,
        title: 'Gathering of Verse',
        body: `In the Mehfil of hearts,\nWords dance like light,\nBanishing the dark,\nIn the middle of the night.`,
        tags: ['mehfil', 'verse'],
      },
    });
  }

  console.log('Seed successful');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
