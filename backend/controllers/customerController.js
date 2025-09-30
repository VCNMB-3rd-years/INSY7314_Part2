const customer = require('../models/customerModel.js')
const bcrypt = require('bcrypt');



//Registration of a Customer 
const register = async (req, res) => {
    //Information needed for registration

    const {
        fullName,
        idNumber,
        accNumber,
        userPassword
    } = req.body

    //Error handeling > make sure that user enters all the information in the input boxs/fields stuff
        if(){
            return res.status(400).json({message: "Enter all the fields please"})
        }

     //Checks if customer exists
     const checksIfCustomerExists = await customer.findOne({idNumber})   
        if(checksIfCustomerExists)
        {
            return res.status(400).json({message: "Customer already exists."});
        }

    
    try{

        //Create a new Customer
        const Customer = await customer.create(
            {
            fullName,
            idNumber,
            accNumber,
            userPassword
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
    register
}