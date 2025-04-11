const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.user = async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({where: { id : req.user.id}});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Utilisateur authentifié",
      user,
    });
  };