const express = require("express");
const placeController = require("../controllers/placeController");
const authenticateToken = require("../middleware/authMiddleware");
const isOwner = require("../middleware/isOwnerPlace");

const router = express.Router();

router.post("/places", authenticateToken, placeController.createPlace);

router.get("/places", authenticateToken, placeController.getAllPlaces);
router.get("/places/:id", authenticateToken, placeController.getPlaceById);

// Middleware isOwner protect the routes
router.patch(
  "/places/:id",
  authenticateToken,
  isOwner,
  placeController.updatePlace
);
router.delete(
  "/places/:id",
  authenticateToken,
  isOwner,
  placeController.deletePlace
);

module.exports = router;
