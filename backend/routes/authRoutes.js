const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getCurrentUser } = require('../controllers/authController');

const router = express.Router();

router.get('/current', verifyToken, getCurrentUser);   // <-- the new endpoint

module.exports = router;