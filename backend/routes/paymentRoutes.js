const express = require('express') //import express to use methods and functionality
const {findOneAndReplace} = require('../models/paymentModel.js')

const {createPayment, verifyPayment, getPendingPayments} = require('../controllers/paymentController.js') //call in necessary methods from controller

const router = express.Router() //set up a router instance

//API ENDPOINTS
router.get('/', getPendingPayments) //returns all 
router.post('/', createPayment) //accepts new payment object
router.put('/:id', verifyPayment) //verifies an existing payment

module.exports = router