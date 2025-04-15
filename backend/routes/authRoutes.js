const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post(
  "/auth/signup",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      await authController.signup(req, res);
    } catch (err) {
      console.error("🔥 SERVER CRASHED:", err);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
);

module.exports = router;
