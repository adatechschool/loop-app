const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.user = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Utilisateur authentifié", user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateUser = async (req, res) => {
  const { username, email, profilePicture } = req.body;

  const updateData = {};
  if (typeof username === "string" && username.trim() !== "")
    updateData.username = username.trim();
  if (typeof email === "string" && email.trim() !== "")
    updateData.email = email.trim();
  if (typeof profilePicture === "string" && profilePicture.trim() !== "")
    updateData.profilePicture = profilePicture.trim();

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.status(200).json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte" });
  }
};

exports.getUserFavorites = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        place: {
          include: {
            types: true,
            images: { include: { image: true } },
            geo: true,
            author: true,
          },
        },
      },
    });

    const favoritePlaces = favorites.map((fav) => fav.place);

    res.status(200).json({
      success: true,
      message: "User favorites fetched successfully",
      favorites: favoritePlaces,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching favorites" });
  }
};

// 🔹 Ajouter un favori
exports.addFavorite = async (req, res) => {
  const { userId, placeId } = req.body;

  try {
    // Vérifie si le favori existe déjà
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        placeId,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Ce favori existe déjà." });
    }

    // Crée le favori
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        placeId,
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du favori." });
  }
};

exports.removeFavorite = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { placeId } = req.params;

  try {
    await prisma.favorite.delete({
      where: { userId_placeId: { userId: req.user.id, placeId } },
    });

    res
      .status(200)
      .json({ success: true, message: "Place removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing favorite" });
  }
};
