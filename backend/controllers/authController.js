const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dropbox = require("dropbox").Dropbox;
const fs = require("fs");
const prisma = new PrismaClient();

const dropboxClient = new dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

exports.signup = async (req, res) => {
  const { name, username, email, password, role = "user" } = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Please upload a profile picture." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload the file to Dropbox
    const dropboxPath = `/profile_pictures/${file.originalname}`;
    const imageData = fs.readFileSync(file.path);

    await dropboxClient.filesUpload({
      path: dropboxPath,
      contents: imageData,
      mode: "overwrite",
    });

    // Create a public shared link for the file
    let sharedLink;
    try {
      sharedLink = await dropboxClient.sharingCreateSharedLinkWithSettings({
        path: dropboxPath,
      });
    } catch (error) {
      if (error?.error?.error_summary?.includes("shared_link_already_exists")) {
        const links = await dropboxClient.sharingListSharedLinks({
          path: dropboxPath,
          direct_only: true,
        });
        sharedLink = { result: { url: links.result.links[0].url } };
      } else {
        throw error;
      }
    }

    // Convert to direct image URL
    const profilePictureUrl = sharedLink.result.url.replace("?dl=0", "?raw=1");

    // Create the user in the DB
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        profilePicture: profilePictureUrl,
      },
    });

    // Clean up local file
    fs.unlinkSync(file.path);

    // Auto-login after signup
    req.login(newUser, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        return res.status(500).json({
          message: "Signup succeeded but login failed.",
        });
      }

      return res.status(201).json({
        message: "User created and logged in successfully!",
        user: { ...newUser, password: undefined },
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (file?.path) fs.unlinkSync(file.path);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};
