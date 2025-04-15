const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
require("./config/passport")(passport);

const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // 👈 allow cookies to be sent
  })
);

app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
