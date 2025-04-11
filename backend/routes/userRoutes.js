const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware.js');

router.get('/user', authenticateToken, userController.user)

module.exports = router;