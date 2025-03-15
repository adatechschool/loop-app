const express = require("express");
const app = express();

exports.user = (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    res.json({ message: "User data has been fetched !", user: req.user });
  };