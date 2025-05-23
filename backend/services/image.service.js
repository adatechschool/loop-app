const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createImageService(url) {

  const image = await prisma.image.create({
    data: { url }
  });

  return { image_id: image.id };
}

module.exports = { createImageService };