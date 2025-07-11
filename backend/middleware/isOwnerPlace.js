const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const placeId = req.params.id;
    if (!placeId || typeof placeId !== "string") {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const userId = req.user.id;

    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { authorId: true }, // ✅ le bon champ relationnel
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (place.authorId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
