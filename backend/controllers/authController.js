const passport = require("passport");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

exports.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Génération du token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.SESSION_SECRET,
        { expiresIn: "1h" }
      );

      // On renvoie le token et les infos utiles de l'utilisateur (sans mot de passe)
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    });
  })(req, res, next);
};

exports.signup = async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    role = "user",
    profilePicture,
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        profilePicture,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ message: "Error during signup", error: err.message });
  }
};
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};
