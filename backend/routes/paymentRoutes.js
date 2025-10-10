const express = require('express') //import express to use methods and functionality

const {createPayment, verifyPayment, getPendingPayments, getCustomerPayments, deleteAllPayments} = require('../controllers/paymentController.js') //call in necessary methods from controller
const { verifyToken } = require('../middleware/authMiddleware.js')
const rateLimit = require('express-rate-limit');

// Set up rate limiter: maximum of 10 requests per 3 minutes per IP this is for testing the low time
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 10, 
  message: "Too many requests from this IP, please try again after 3 minutes",
}); // Frontend Highlights, 2024


const router = express.Router() //set up a router instance 

router.use(limiter) // Frontend Highlights, 2024

//API ENDPOINTS
router.get('/', getPendingPayments) //returns all pending payments
router.get('/customer', verifyToken, getCustomerPayments) //verify logged in user and pull all their payments
router.post('/', verifyToken, createPayment) //accepts new payment object
router.put('/:id', verifyToken, verifyPayment) //verifies an existing payment
//router.delete('/delete', deleteAllPayments) TESTING

module.exports = router

/*
References
Frontend Highlights. 2024. Creating a Simple API Rate Limiter with NodeJs. [online] available at: https://medium.com/@ignatovich.dm/creating-a-simple-api-rate-limiter-with-node-a834d03bad7a date accessed 10 October 2025

*/