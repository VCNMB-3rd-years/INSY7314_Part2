const express = require('express')
const router = express.Router();

const {registerEmployee} = require('../controllers/employeeController.js')


//API endpoints
router.post('/registerEmployee', registerEmployee) //Registers the Employee

module.exports = router

//Added a comment
