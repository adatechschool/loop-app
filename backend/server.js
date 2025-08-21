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
const placeRoutes = require("./routes/placeRoutes");
const imageRoutes = require("./routes/imageRoutes");
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://loop-dev.netlify.app",
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some(
          (o) => origin.endsWith(".netlify.app") || o === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
app.use(BASE_PATH, placeRoutes);
app.use(BASE_PATH, imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
