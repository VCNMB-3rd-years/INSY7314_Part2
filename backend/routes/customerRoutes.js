const express = require('express')

const {register, login } = require('../controllers/customerController.js')

const router = express.Router()

//API endpoints
router.post('/register', register) //Registers the Customer

router.post('/login', login); // Logs the customer in

//Testing puposes:

const Customer = require('../models/customerModel');
router.get('/all', async (req, res) => {
  const list = await Customer.find().select('-userPassword');
  res.json(list);
});


module.exports = router
