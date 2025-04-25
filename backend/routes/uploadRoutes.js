const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { uploadImage } = require("../controllers/uploadController");

const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
