const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/user", authenticateToken, userController.user);

router.patch("/user", authenticateToken, userController.updateUser);

router.put("/user", authenticateToken, userController.updateUser);

router.delete("/user", authenticateToken, userController.deleteUser);

module.exports = router;
