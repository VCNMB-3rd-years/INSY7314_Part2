const express = require('express')

const {register} = require('../controllers/customerController.js')

const router = express.Router()

//API endpoints
router.post('/register', register) //Registers the Customer


//Testing puposes:

const Customer = require('../models/customerModel');
router.get('/all', async (req, res) => {
  const list = await Customer.find().select('-userPassword');
  res.json(list);
});


module.exports = router
