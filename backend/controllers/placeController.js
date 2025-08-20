const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPlace = async (req, res) => {
  const { name, address, description, accessibility, geo, types, images } =
    req.body;

  try {
    const userId = req.user.id;

    const geoData = await prisma.geo.create({
      data: {
        lat: geo.lat,
        lng: geo.lng,
      },
    });

    const newPlace = await prisma.place.create({
      data: {
        name,
        address,
        description: description || null,
        accessibility,
        authorId: userId,
        geoId: String(geoData.id),
        types: {
          create: types.map((typeId) => ({
            type: { connect: { id: typeId } },
          })),
        },
        images: {
          create: images.map((imageId) => ({
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
      },
    });

    const formattedPlace = {
      ...newPlace,
      types: newPlace.types.map((type) => type.typeId),
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
    const usersPlaces = await prisma.place.findMany({
      include: {
        types: true,
        images: { include: { image: true } },
        geo: true,
        author: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "All places fetched successfully",
      places: usersPlaces,
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
  try {
    const place = await prisma.place.findUnique({
      where: { id: id },
      include: {
        types: true,
        images: { include: { image: true } },
        geo: true,
        author: true,
      },
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({
      message: "Place fetched successfully",
      place,
    });
  } catch (error) {
    console.error("Error fetching place:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching place",
      error: error.message,
      stack: error.stack, // pour debugger
    });
  }
};

exports.updatePlace = async (req, res) => {
  const { id } = req.params;
  const { name, address, description, accessibility, geo, types } = req.body;

  try {
    const place = await prisma.place.findUnique({
      where: { id: id },
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const updatedPlace = await prisma.place.update({
      where: { id: id },
      data: {
        name,
        address,
        description: description || null,
        accessibility,
        geo: {
          update: {
            lat: geo.lat,
            lng: geo.lng,
          },
        },
        types: {
          deleteMany: {},
          create: types.map((typeId) => ({
            type: { connect: { id: typeId } },
          })),
        },
      },
      include: {
        types: true,
      },
    });

    const formattedPlace = {
      ...updatedPlace,
      types: updatedPlace.types.map((type) => type.typeId),
    };

    res.status(200).json({
      message: "Place updated successfully",
      place: formattedPlace,
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
  const { id } = req.params;
  const placeId = id.trim();

  try {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    await prisma.$transaction([
      prisma.placeUser.deleteMany({
        where: { placeId: placeId },
      }),
      prisma.placeType.deleteMany({
        where: { placeId: placeId },
      }),
      prisma.placeImage.deleteMany({
        where: { placeId: placeId },
      }),
      prisma.place.delete({
        where: { id: placeId },
      }),
    ]);

    res
      .status(200)
      .json({ message: "Place and all related records deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({
      message: "Error deleting place",
      error: error.message,
    });
  }
};
