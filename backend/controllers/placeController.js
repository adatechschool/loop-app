const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPlace = async (req, res) => {
  const { name, address, description, accessibility, geo, types, images } = req.body;

  try {
    const userId = req.user.id;
    const author = req.user.username;

    const geoData = await prisma.geo.create({
      data: {
        lat: geo.lat,
        lng: geo.lng,
      },
    });

    console.log({
      name,
      address,
      description: description || null,
      accessibility,
      author,
      geoId: String(geoData.id),
      types: {
        connect: types.map(id => ({ id })), // example: [{ id: 1 }, { id: 2 }]
      },
      images: {
        connect: images.map(id => ({ id })), // same here
      },
      users: {
        create: {
          user: { connect: { id: userId } },
        },
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
          create: types.map(typeId => ({
            type: { connect: { id: typeId } }
          })),
        },
    
        // Create or connect join records for PlaceImage
        images: {
          create: images.map(imageId => ({
            image: { connect: { id: imageId } }
          })),
        },
        users: {
          create: {
            user: { connect: { id: userId } },
          },
        },
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
