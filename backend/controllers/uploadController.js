// controllers/uploadController.js
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = req.file.path; // Cloudinary gives this in .path
    return res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Image upload failed." });
  }
};

module.exports = { uploadImage };
