const passport = require('passport');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.SESSION_SECRET, {
        expiresIn: '1h'
      });

      return res.json({ message: 'Login successful', user: { id: user.id, username: user.username, token} });
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
        return res.status(400).json({ message: "User already exist !" });
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
      res
        .status(201)
        .json({ message: "User created with success", user: userWithoutPassword });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error during signup:", error: err.message });
    }
  }

