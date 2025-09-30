const express = require('express')

const {register} = require('../controllers/customerController.js')

const router = express.Router()

//API endpoints
router.post('/register', register) //Registers the Customer

module.exports = router
