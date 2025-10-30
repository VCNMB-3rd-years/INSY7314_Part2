const express = require('express')
const ExpressBrute = require('express-brute');
const { verifyToken } = require('../middleware/authMiddleware.js')
const { register, login, logout } = require('../controllers/customerController.js')
const rateLimit = require('express-rate-limit');

// Set up rate limiter: maximum of 10 requests per 3 minutes per IP this is for testing the low time
const limiter = rateLimit({
	windowMs: 3 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again after 3 minutes",
}); // Frontend Highlights, 2024

const store = new ExpressBrute.MemoryStore();

//There are two ways of brute attack 1. user and then 2.per IP 

//User brute attack (the user shouldnt login wrong more than 5 times) 
const failCallback = function (req, res, next, nextValidRequestData) {
	res.status(429).json({ message: "Sorry, you have made too many attempts. Try again laters" })

}

//Normal error handeling
var handleStoreError = function (error) {
	console.error(error)
};



//USER BRUTE FORCE 
var userBruteforce = new ExpressBrute(store, {
	freeRetries: 5,
	minWait: 5 * 60 * 1000, // 5 minutes
	maxWait: 60 * 60 * 1000, // 1 hour,
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

//IP Brute FORCE 
var globalBruteforce = new ExpressBrute(store, {
	freeRetries: 1000,
	attachResetToRequest: false,
	refreshTimeoutOnRequest: false,
	minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour 
	maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour 
	lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

const router = express.Router()
router.use(limiter)
//API endpoints
router.post('/register', register) //Registers the Customer

//Applying both brute-attacks (AdamPflug, 2020)
router.post('/login',
	globalBruteforce.prevent,
	userBruteforce.getMiddleware({
		key: function (req, res, next) {
			const key = `${req.body.fullName}_${req.body.accNumber}`
			next(key)
		}
	}), login); // Logs the customer in

router.post('/logout', verifyToken, logout) //DEFINITELY HAVE TO IMPLEMENT A LOGOUT FUNCTION

//router.delete('/deleteAll', deleteAll)


//Testing puposes:

const Customer = require('../models/customerModel');
router.get('/all', async (req, res) => {
	const list = await Customer.find().select('-userPassword');
	res.json(list);
});


module.exports = router


/*REFERENCE
========================
AdamPflug, 2020. express-brute. [Online]. Available at: https://github.com/AdamPflug/express-brute [Accessed 9 October 2025]
 */