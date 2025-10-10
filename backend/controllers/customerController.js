const customer = require('../models/customerModel.js')
const generateJwt = require('../controllers/authController.js')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { invalidateToken } = require('../middleware/authMiddleware.js')

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

        // sanitize inputs
        const sanitizedFullName = validator.escape(fullName?.toString() || '');
        const sanitizedIdNumber = validator.escape(idNumber?.toString() || '');
        const sanitizedAccNumber = validator.escape(accNumber?.toString() || '');
        const sanitizedUserPassword = userPassword?.toString() || '';

        //validates the imputs 
        if (!validator.matches(sanitizedFullName, /^[a-zA-Z0-9\s]+$/)) {
            return res.status(400).json({ message: "Full name must contain only letters, numbers, and spaces" });
        }
        if (!validator.isLength(sanitizedFullName, { min: 3, max: 30 })) {
            return res.status(400).json({ message: "Full name must be between 3 and 30 characters" });
        }
        if (!validator.matches(sanitizedIdNumber, /^[0-9]+$/)) {
            return res.status(400).json({ message: "ID number must contain only numbers" });
        }
        if (!validator.isLength(sanitizedIdNumber, { max: 13 })) {
            return res.status(400).json({ message: "ID number cannot exceed 13 characters" });
        }
        if (!validator.matches(sanitizedAccNumber, /^acc\d{9}$/)) {
            return res.status(400).json({ message: "Account number must start with 'acc' followed by exactly 9 digits" });
        }
        if (!validator.isLength(sanitizedUserPassword, { min: 8, max: 16 })) {
            return res.status(400).json({ message: "Password must be between 8 and 16 characters" });
        }
        if (!validator.matches(sanitizedUserPassword, /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])[\S]{8,16}$/)) {
            return res.status(400).json({ message: "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character" });
        }

        //Checks if customer exists
        const checksIfCustomerExists = await customer.findOne({ idNumber: sanitizedIdNumber, accNumber: sanitizedAccNumber })
        if (checksIfCustomerExists) {
            return res.status(400).json({ message: "Customer already exists." });
        }

        //Create a new Customer
        const createdCustomer = await customer.create(
            {
                fullName: sanitizedFullName,
                idNumber: sanitizedIdNumber,
                accNumber: sanitizedAccNumber,
                userPassword: sanitizedUserPassword
            })

        // (Gyawali, 2024)
        const safe = createdCustomer.toObject ? createdCustomer.toObject() : createdCustomer;
        delete safe.userPassword;        
        return res.status(201).json({ message: "Customer registered", customer: safe });
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

//Login of a Customer 
const login = async (req, res) => {
    try {
        const { fullName, accNumber, userPassword } = req.body;

        if (!fullName || !accNumber || !userPassword) {
            return res.status(400).json({ message: error.message });
        } // simple check to see if fields are fileld

        // sanitize inputs
        const sanitizedFullName = validator.escape(fullName?.toString() || '');
        const sanitizedAccNumber = validator.escape(accNumber?.toString() || '');
        const sanitizedUserPassword = userPassword?.toString() || '';

        //validates the imputs 
        if (!validator.matches(sanitizedFullName, /^[a-zA-Z0-9\s]+$/)) {
            return res.status(400).json({ message: "Full name must contain only letters, numbers, and spaces" });
        }
        if (!validator.isLength(sanitizedFullName, { min: 3, max: 30 })) {
            return res.status(400).json({ message: "Full name must be between 3 and 30 characters" });
        }
        if (!validator.matches(sanitizedAccNumber, /^acc\d{9}$/)) {
            return res.status(400).json({ message: "Account number must start with 'acc' followed by exactly 9 digits" });
        }
        if (!validator.isLength(sanitizedUserPassword, { min: 8, max: 16 })) {
            return res.status(400).json({ message: "Password must be between 8 and 16 characters" });
        }

        // this tries to find the user in the db based on fullName and accNumber
        const customerData = await customer.findOne({ fullName: sanitizedFullName, accNumber: sanitizedAccNumber }).select('+userPassword');
        if (!customerData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // using matchPassword to mathc password to the one in the db
        const isMatch = await customerData.matchPassword(sanitizedUserPassword);
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

            const token = generateJwt({ //pass sanitized fields to jwt to store logged user in headers for payment verification
                fullName: sanitizedFullName,
                accNumber: sanitizedAccNumber,
            }, 
            "customer")

            res.cookie('token', token, {
                httpOnly: true, //javascript cant access the cookie so jwt is safe here
                secure: true, // sends only over https
                sameSite: 'Strict', //prevents crsf from different origins
                maxAge: 3 * 60 * 60 * 1000 //3 hours until expiratiaon
        })
            console.log('Cookie tracking', res.cookie.token) //TESTING, WANT TO SEE IF TOKEN STORES HERE
            return res.status(200).json({ message: "Login successful", customer: safeCustomer, token: token });
        })

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: error.message });
    }
}

//added so long, still need a button to connect to, maybe on portal and make payment screens?
const logout = async(req, res) => {
    const authHeader = req.headers['authorization'] //strip header for token value
    const token = authHeader.split(" ")[1]
    if (!token) { 
        return res.status(400).json({message: "You need to be logged in before you can log out"}) //check if there is a token, if not error
    }
    invalidateToken(token) //else handle blacklisting it
    res.clearCookie('token', { //clear out the cookie to clear out the jwt and session as well
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    })
    res.status(200).json({message: "Logged out successfully"}) //when succesful, log them out
}

module.exports = {
    register,
    login,
    logout
}

/*
    REFERENCES
    =====================
    Gyawali, B. 2024. Hiding Credentials in Response with Mongoose and Nodejs. [Online]. Available at: https://medium.com/@vikramgyawali57/hiding-credentials-in-response-with-mongoose-and-nodejs-a5d591b373e6 [Accessed 30 September 2025]
    GeeksforGeeks. 2025. How to Validate Data using validator Module in Node.js ? [online] https://www.geeksforgeeks.org/node-js/how-to-validate-data-using-validator-module-in-node-js/ date accessed 09 October 2025
*/