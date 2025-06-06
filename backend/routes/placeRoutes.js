const express = require("express");
const placeController = require("../controllers/placeController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
console.log(placeController);
router.post("/places", authenticateToken, placeController.createPlace);
router.get("/places", authenticateToken, placeController.getAllPlaces);
router.get("/places/:id", authenticateToken, placeController.getPlaceById);


module.exports = router;
