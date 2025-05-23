const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createImageService } = require("../services/image.service");

exports.createImage = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL manquante" });
    }

    const image = await createImageService(url);

    return res.status(201).json(image);
  } catch (error) {
    console.error("Erreur création image :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
