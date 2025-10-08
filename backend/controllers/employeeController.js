const Employee = require('../models/employeeModel.js')
const bcrypt = require('bcryptjs');

//Registration of a Customer (post)
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
            return res.status(400).json({ message: "Customer already exists." });
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

        return res.status(200).json({ message: "Login successful", employee: safeEmployee });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

module.exports = {
    registerEmployee,
    loginEmployee
}