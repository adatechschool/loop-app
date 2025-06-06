const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPlace = async (req, res) => {
  const { name, address, description, accessibility, geo, types, images } =
    req.body;

  try {
    const userId = req.user.id;
    const author = req.user.username;

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
        author,
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
      },
    })

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
    });
  }
};

