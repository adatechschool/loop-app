const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPlace = async (req, res) => {
  const { name, address, description, accessibility, geo, types, images } =
    req.body;

  try {
    const userId = req.user.id;

    if (!geo || typeof geo.lat !== "number" || typeof geo.lng !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid or missing geo coordinates" });
    }

    const geoData = await prisma.geo.create({
      data: {
        lat: geo.lat,
        lng: geo.lng,
      },
    });

    const typesArray = Array.isArray(types) ? types : [];
    const imagesArray = Array.isArray(images) ? images : [];

    const newPlace = await prisma.place.create({
      data: {
        name,
        address,
        description: description ?? null,
        accessibility,
        author,
        authorId: userId,
        geoId: geoData.id,
        types: {
          create: typesArray.map((typeId) => ({
            type: { connect: { id: typeId } },
          })),
        },
        images: {
          create: imagesArray.map((imageId) => ({
            image: { connect: { id: imageId } },
          })),
        },
        users: {
          create: {
            user: { connect: { id: userId } },
          },
        },
      },
      include: {
        types: true,
        images: { include: { image: true } },
        geo: true,
      },
    });

    const formattedPlace = {
      ...newPlace,
      types: newPlace.types.map((type) => type.typeId),
      images: newPlace.images.map((img) => img.imageId),
    };

    res
      .status(201)
      .json({ message: "Place created successfully", place: formattedPlace });
  } catch (error) {
    console.error("Error creating place:", error);
    res
      .status(500)
      .json({ message: "Error creating place", error: error.message });
  }
};

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await prisma.place.findMany({
      include: {
        types: true,
        images: { include: { image: true } },
        geo: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "All places fetched successfully",
      places,
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching places",
    });
  }
};

exports.getPlaceById = async (req, res) => {
  const { id } = req.params;
  console.log("Requête getPlaceById, id:", id);

  try {
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        geo: true,
        types: {
          include: {
            type: true,
          },
        },

        images: {
          include: { image: true },
        },
        authorUser: {
          select: {
            id: true,
            username: true,
          },
        },
        favorites: {
          select: {
            id: true,
            userId: true,
          },
        },
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!place) {
      console.log("Place non trouvée");
      return res.status(404).json({ message: "Place not found" });
    }

    console.log("Place trouvée:", place);

    res.status(200).json({
      message: "Place fetched successfully",
      place,
    });
  } catch (error) {
    console.error("Erreur getPlaceById:", error); // ✅ log complet

    res.status(500).json({
      success: false,
      message: "Error fetching place",
      error: error.message, // ✅ message clair
      stack: error.stack, // ✅ infos détaillées (chemin, ligne, etc.)
    });
  }
};

exports.updatePlace = async (req, res) => {
  const placeId = req.params.id;
  const userId = req.user.id;
  const { name, address, description, accessibility, geo, types, images } =
    req.body;

  try {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { authorId: true, geoId: true },
    });

    if (!place) return res.status(404).json({ message: "Place not found" });
    if (place.authorId !== userId)
      return res
        .status(403)
        .json({ message: "Not authorized to update this place" });

    if (geo && typeof geo.lat === "number" && typeof geo.lng === "number") {
      await prisma.geo.update({
        where: { id: place.geoId },
        data: {
          lat: geo.lat,
          lng: geo.lng,
        },
      });
    }

    if (Array.isArray(types)) {
      const existingTypes = await prisma.placeType.findMany({
        where: { placeId },
        select: { typeId: true },
      });
      const existingTypeIds = existingTypes.map((t) => t.typeId);

      const toAddTypes = types.filter((t) => !existingTypeIds.includes(t));
      const toRemoveTypes = existingTypeIds.filter((t) => !types.includes(t));

      if (toAddTypes.length > 0) {
        await prisma.placeType.createMany({
          data: toAddTypes.map((typeId) => ({ placeId, typeId })),
        });
      }
      if (toRemoveTypes.length > 0) {
        await prisma.placeType.deleteMany({
          where: {
            placeId,
            typeId: { in: toRemoveTypes },
          },
        });
      }
    }

    if (Array.isArray(images)) {
      const existingImages = await prisma.placeImage.findMany({
        where: { placeId },
        select: { imageId: true },
      });
      const existingImageIds = existingImages.map((i) => i.imageId);

      const toAddImages = images.filter((i) => !existingImageIds.includes(i));
      const toRemoveImages = existingImageIds.filter(
        (i) => !images.includes(i)
      );

      if (toAddImages.length > 0) {
        await prisma.placeImage.createMany({
          data: toAddImages.map((imageId) => ({ placeId, imageId })),
        });
      }
      if (toRemoveImages.length > 0) {
        await prisma.placeImage.deleteMany({
          where: {
            placeId,
            imageId: { in: toRemoveImages },
          },
        });
      }
    }

    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        name,
        address,
        description: description ?? null,
        accessibility,
      },
      include: {
        geo: true,
        types: true,
        images: { include: { image: true } },
      },
    });

    res.status(200).json({
      message: "Place updated successfully",
      place: updatedPlace,
    });
  } catch (error) {
    console.error("Error updating place:", error);
    res.status(500).json({
      message: "Error updating place",
      error: error.message,
    });
  }
};

exports.deletePlace = async (req, res) => {
  const placeId = req.params.id;
  const userId = req.user.id;

  try {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { authorId: true },
    });

    if (!place) return res.status(404).json({ message: "Place not found" });
    if (place.authorId !== userId)
      return res
        .status(403)
        .json({ message: "Not authorized to delete this place" });

    await prisma.place.delete({ where: { id: placeId } });

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({
      message: "Error deleting place",
      error: error.message,
    });
  }
};
