const express = require('express')

const router = express.Router();

const { registerEmployee, loginEmployee,  logoutEmployee, viewAllEmployees, deleteAnEmployee } = require('../controllers/employeeController.js')
const { verifyToken } = require('../middleware/authMiddleware.js')
const rateLimit = require('express-rate-limit');

// Set up rate limiter: maximum of 10 requests per 3 minutes per IP this is for testing the low time
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 3 minutes",
}); // Frontend Highlights, 2024

router.use(limiter)

//API endpoints
router.post('/registerEmployee', registerEmployee) //Registers the Employee
router.post('/loginEmployee', loginEmployee)
router.get('/viewAllEmployees', verifyToken, viewAllEmployees)
router.post('/logout', logoutEmployee) //DEFINITELY HAVE TO IMPLEMENT A LOGOUT FUNCTION

//Testing purpose
const Employee = require('../models/employeeModel');
router.get('/all', async (req, res) => {
  const list = await Employee.find().select('-password');
  res.json(list);
});


module.exports = router