const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new (require("passport-local").Strategy)(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "Email non trouvé" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Mot de passe incorrect" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (req, res) => res.send("Hello world !!"));

app.post("/signup", async (req, res) => {
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
      return res.status(400).json({ message: "Utilisateur déjà existant !" });
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

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès !", user: newUser });
  } catch (err) {
    console.error("Error during signup:", err);
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: err.message });
  }
});

app.post(
  "/login",
  passport.authenticate("local", { failureMessage: "Identifiants incorrects" }),
  (req, res) => {
    res.json({ message: "Connexion réussie !", user: req.user });
  }
);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  res.json({ message: "Bienvenue sur votre profil !", user: req.user });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
