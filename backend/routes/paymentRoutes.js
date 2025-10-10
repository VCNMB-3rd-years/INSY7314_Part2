const express = require('express') //import express to use methods and functionality

const {createPayment, verifyPayment, getPendingPayments, getCustomerPayments, deleteAllPayments} = require('../controllers/paymentController.js') //call in necessary methods from controller
const { verifyToken } = require('../middleware/authMiddleware.js')

const router = express.Router() //set up a router instance

//API ENDPOINTS
router.get('/', getPendingPayments) //returns all pending payments
router.get('/customer', verifyToken, getCustomerPayments) //verify logged in user and pull all their payments
router.post('/', verifyToken, createPayment) //accepts new payment object
router.put('/:id', verifyToken, verifyPayment) //verifies an existing payment
//router.delete('/delete', deleteAllPayments) TESTING

module.exports = router