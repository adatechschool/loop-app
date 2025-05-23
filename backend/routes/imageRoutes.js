const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/images", authenticateToken, imageController.createImage);

module.exports = router;