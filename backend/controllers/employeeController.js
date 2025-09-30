const Employee = require('../models/employeeModel.js')
const bcrypt = require('bcryptjs');

//Registration of a Customer 
const registerEmployee = async (req, res) => {
    //Information needed for registration

    const {
        username,
        password
    } = req.body

    //Error handeling > make sure that user enters all the information in the input boxs/fields stuff
        if(!username||!password){
            return res.status(400).json({message: "Enter all the fields please"})
        }

     //Checks if customer exists
     const checksIfEmployeeExists = await Employee.findOne({username})   
        if(checksIfEmployeeExists)
        {
            return res.status(400).json({message: "Customer already exists."});
        }

    
    try{

        //Create a new Customer
        const Employee = await Employee.create(
            {
            username,
            password
            })

    }
    catch(error)
    {
        return res.status(500).json({error: "Server error during registration."})
    }
}

//Login of a Customer 
const login = async (req, res) => {}

module.exports = {
    registerEmployee
}