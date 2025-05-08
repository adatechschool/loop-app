const express = require("express");
const placeController = require("../controllers/placeController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
console.log(placeController);
router.post("/places", authenticateToken, placeController.createPlace);

module.exports = router;
