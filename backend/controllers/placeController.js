const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createPlace = async (req, res) => {
  const { name, address, description, accessibility, geo, types, images } =
    req.body;

  try {
    const userId = req.user.id;
    const author = req.user.username;
    const newPlace = await prisma.place.create({
      data: {
        name,
        address,
        description,
        accessibility,
        author,
        geoId: geoData.id, // Link the Geo relation
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
    });

    const geoData = await prisma.geo.create({
      data: {
        lat: geo.lat,
        lng: geo.lng,
      },
    });

    res
      .status(201)
      .json({ message: "Place created successfully", place: newPlace });
  } catch (error) {
    console.error("Error creating place:", error);
    res
      .status(500)
      .json({ message: "Error creating place", error: error.message });
  }
};
