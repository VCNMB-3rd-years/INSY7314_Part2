const Employee = require('../models/employeeModel.js')
const generateJwt = require('../controllers/authController.js')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { invalidateToken } = require('../middleware/authMiddleware.js')

//Registration of a Employee > ONLY THE MAIN ADMIN CAN DO IT (post)
const registerEmployee = async (req, res) => {
    //Information needed for registration
    try {
        const {
            username,
            password
        } = req.body

        //Error handeling > make sure that user enters all the information in the input boxs/fields stuff
        if (!username || !password) {
            return res.status(400).json({ message: "Enter all the fields please" })
        }

        //Checks if customer exists
        const checksIfEmployeeExists = await Employee.findOne({ username })
        if (checksIfEmployeeExists) {
            return res.status(400).json({ message: "Employee already exists." });
        }



        //Create a new Customer
        const createdEmployee = await Employee.create(
            {
                username,
                password
            })

        const safe = createdEmployee.toObject ? createdEmployee.toObject() : createdEmployee;
        delete safe.password;
        return res.status(201).json({ message: "Employee registered", employee: safe });


    }
    catch (error) {
        return res.status(500).json({ error: "Server error during registration." })
    }
}

//Login of a Employee 
const loginEmployee = async (req, res) => {
    try {
        const { 
            username,
            password
        } = req.body

        // make sure that user enters all the information in the input boxs/fields stuff
        if (!username || !password) {
            return res.status(400).json({ message: "Enter all the fields please" })
        }

        // sanitize inputs
        const sanitizedUsername = validator.escape(username?.toString() || '');
                
        //validates the imputs 
        if (!validator.matches(sanitizedUsername, /^[a-zA-Z0-9\s]+$/)) {
            return res.status(400).json({ message: "Username must contain only letters, numbers, and spaces" });
        }

        // this tries to find the user in the db based on fullName and accNumber
        const employeeData = await Employee.findOne({ username }).select('+password'); 
        if (!employeeData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // using matchPassword to mathc password to the one in the db
        const isMatch = await employeeData.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        } // check customerController.js's login endpoint for why both say invalid credentials

        // (Gyawali, 2024)
        const safeEmployee = employeeData.toObject ? employeeData.toObject() : employeeData;
        delete safeEmployee.password;

        const token = generateJwt({ //pass sanitized fields to jwt to store logged user in headers for payment verification
            username: sanitizedUsername
            },
        "employee")

        return res.status(200).json({ message: "Login successful", employee: safeEmployee, token: token});
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Server error during login" });
    }
};


//This can be done by all admins 
const viewAllEmployees = async (req, res) => {
try {
        const employees = await Employee.find().select('-password');
        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


//This can be done by all admins 
const deleteAnEmployee = async (req, res) => {
  // get the id of the Employee we want to remove
  const id = req.params.id;

  // null check
  if (!id) {
    res.status(400).json({ message: "Please provide an ID to delete." });
  }

  // first try find the employee
  try {
    var employee = await Employee.findById(id);

    // if no employee, 404 and exit the method
    if (!employee) {
      res.status(404).json({ message: "No book found that matches that ID." });
    }

    // find the employee, delete it, and return what it was
    employee = await Employee.findByIdAndDelete(id);
    res.status(202).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    registerEmployee,
    loginEmployee,
    viewAllEmployees,
    deleteAnEmployee

}