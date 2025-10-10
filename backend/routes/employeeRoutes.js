const express = require('express')




const router = express.Router();

const {registerEmployee, loginEmployee} = require('../controllers/employeeController.js')


//API endpoints
router.post('/registerEmployee', registerEmployee) //Registers the Employee
router.post('/loginEmployee', loginEmployee)


//Testing purpose
const Employee = require('../models/employeeModel');
router.get('/all', async (req, res) => {
  const list = await Employee.find().select('-password');
  res.json(list);
});


module.exports = router

//Added a comment
