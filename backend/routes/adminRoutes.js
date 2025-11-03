const express = require('express');
const rateLimit = require('express-rate-limit');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware.js')
const ExpressBrute = require('express-brute');
const { registerAdmin, loginAdmin, logout, deleteEmployee, loggedAdmin } = require('../controllers/adminController.js'); // Import deleteEmployee
const { registerEmployee } = require('../controllers/employeeController.js'); // Import deleteEmployee

// Set up rate limiter: maximum of 10 requests per 3 minutes per IP
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 2000,
    message: "Too many requests from this IP, please try again after 3 minutes",
});

const store = new ExpressBrute.MemoryStore();

// Brute force error handling
const failCallback = function (req, res, next, nextValidRequestData) {
    res.status(429).json({ message: "Sorry, you have made too many attempts. Try again later" });
};

const handleStoreError = function (error) {
    console.error(error);
};

// User brute force protection
const userBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 60 * 60 * 1000, // 1 hour
    failCallback: failCallback,
    handleStoreError: handleStoreError
});

// Global brute force protection
const globalBruteforce = new ExpressBrute(store, {
    freeRetries: 1000,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour
    maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour
    lifetime: 24 * 60 * 60, // 1 day (seconds)
    failCallback: failCallback,
    handleStoreError: handleStoreError
});

const router = express.Router();
router.use(limiter);

// Routes
router.post('/registerAdmin', verifyToken, isSuperAdmin, registerEmployee);
router.post('/login', loginAdmin);
router.post('/logout', logout);
router.delete('/deleteEmployee', verifyToken, deleteEmployee);
router.get('/current', verifyToken, isAdmin, loggedAdmin);

module.exports = router;