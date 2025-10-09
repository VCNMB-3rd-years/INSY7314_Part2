const customer = require('../models/customerModel.js')
const generateJwt = require('../controllers/authController.js')
const bcrypt = require('bcryptjs');

//Registration of a Customer 
const register = async (req, res) => {
    //Information needed for registration
    try {
        const {
            fullName,
            idNumber,
            accNumber,
            userPassword
        } = req.body

        //Error handeling > make sure that user enters all the information in the input boxs/fields stuff
        if (!fullName || !idNumber || !accNumber || !userPassword) {
            return res.status(400).json({ message: "Enter all the fields please" })
        }

        //Checks if customer exists
        const checksIfCustomerExists = await customer.findOne({ idNumber }, { accNumber })
        if (checksIfCustomerExists) {
            return res.status(400).json({ message: "Customer already exists." });
        }

        //Create a new Customer
        const createdCustomer = await customer.create(
            {
                fullName,
                idNumber,
                accNumber,
                userPassword
            })

        // (Gyawali, 2024)
        const safe = createdCustomer.toObject ? createdCustomer.toObject() : createdCustomer;
        delete safe.userPassword;

        return res.status(201).json({ message: "Customer registered", employee: safe, token: generateJwt(fullName) });

    }
    catch (error) {
        return res.status(500).json({ error: "Server error during registration." })
    }
}

//Login of a Customer 
const login = async (req, res) => {
    try {
        const { fullName, accNumber, userPassword } = req.body;

        if (!fullName || !accNumber || !userPassword) {
            return res.status(400).json({ message: "Please ensure that all login details are filled out" });
        } // simple check to see if fields are fileld

        // this tries to find the user in the db based on fullName and accNumber
        const customerData = await customer.findOne({ fullName, accNumber }).select('+userPassword');
        if (!customerData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // using matchPassword to mathc password to the one in the db
        const isMatch = await customerData.matchPassword(userPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        } // these blocks return invalid credentials as a form of security, this is to ensure that bad actors dont realise which credentials are correct and which are incorrect (sorry for the verbose comment)
        // same as in register, hides password (Gyawali, 2024)
        const safeCustomer = customerData.toObject ? customerData.toObject() : customerData;
        delete safeCustomer.userPassword;

        //Reset brute-force counter on successful login
        req.brute.reset(()=> {
            const safeCustomer = customerData.toObject ? customerData.toObject() : customerData;
            delete safeCustomer.userPassword;
            return res.status(200).json({ message: "Login successful", customer: safeCustomer });
        })

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

module.exports = {
    register,
    login
}

/*
    REFERENCES
    =====================
    Gyawali, B. 2024. Hiding Credentials in Response with Mongoose and Nodejs. [Online]. Available at: https://medium.com/@vikramgyawali57/hiding-credentials-in-response-with-mongoose-and-nodejs-a5d591b373e6 [Accessed 30 September 2025]
*/