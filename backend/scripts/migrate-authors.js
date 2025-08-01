const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateAuthors() {
  const places = await prisma.place.findMany();

  for (const place of places) {
    if (place.author) {
      const user = await prisma.user.findUnique({
        where: { username: place.author },
      });

      if (user) {
        await prisma.place.update({
          where: { id: place.id },
          data: {
            authorId: user.id,
          },
        });
        console.log(`✔ Author set for place ${place.name}`);
      } else {
        console.warn(`⚠ User not found for username: ${place.author}`);
      }
    }
  }

  console.log("✅ Migration terminée.");
  await prisma.$disconnect();
}

migrateAuthors();
