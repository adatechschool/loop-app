const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/passport")(passport);

const BASE_PATH = "/api";
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(BASE_PATH, authRoutes);
app.use(BASE_PATH, userRoutes);
app.use(BASE_PATH, uploadRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
