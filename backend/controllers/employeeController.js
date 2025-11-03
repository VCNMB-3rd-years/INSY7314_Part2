const Employee = require('../models/employeeModel.js')
const generateJwt = require('../controllers/authController.js')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { invalidateToken } = require('../middleware/authMiddleware.js')

//Registration of a Employee > ONLY THE MAIN ADMIN CAN DO IT (post)
const registerEmployee = async (req, res) => {
    //Information needed for registration
    try {
        if (req.user.role !== 'admin' && req.user.privilege !== true) { //only main admin has access to this
            return res.status(401).json({message: "Only one admin has access to this function"})
        }

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

        res.cookie('token', token, { //(Ghorbanian and Postal, 2022)
                httpOnly: true, //javascript cant access the cookie so jwt is safe here (Ghorbanian and Postal, 2022)
                secure: true, // sends only over https 
                sameSite: 'Strict', //prevents crsf from different origins (Csarmiento. 8 April 2022)
                maxAge: 3 * 60 * 60 * 1000 //3 hours until expiratiaon (Csarmiento. 8 April 2022)
        })

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
    if (req.user.role !== 'admin') { //only main admin has access to this
            return res.status(401).json({message: "Only admin has access to this function"})
        }

    //GeeksForGeeks, 2025
        const employees = await Employee.find().select('-password');
        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


//added so long, still need a button to connect to, maybe on portal and make payment screens?
const logoutEmployee = async(req, res) => {
    //const authHeader = req.headers['authorization'] //strip header for token value
    //const token = authHeader.split(" ")[1]
    const token = req.cookies.token

    if (token) { 
        invalidateToken(token) //blacklist token 
    }

    invalidateToken(token) //else handle blacklisting it
    res.clearCookie('token', { //clear out the cookie to clear out the jwt and session as well (Ghorbanian and Postal, 2022)
        httpOnly: true, //(Ghorbanian and Postal, 2022)
        secure: true,
        sameSite: 'Strict', //(Csarmiento. 8 April 2022)
        path: '/'
    })
    res.status(200).json({message: "Logged out successfully"}) //when succesful, log them out
}


module.exports = {
    registerEmployee,
    loginEmployee,
    logoutEmployee,
    viewAllEmployees
}


/*References
==================
Csarmiento. 8 April 2022. How to get HTTP-only cookie in React? [Online]. Avaialble at: <https://stackoverflow.com/questions/68970499/how-to-get-http-only-cookie-in-react> [Accessed 9 October 2025]
GeeksForGeeks, 2025. REST API CRUD Operations Using ExpressJS. [Online]. Avaialble at: https://www.geeksforgeeks.org/node-js/rest-api-using-the-express-to-perform-crud-create-read-update-delete/
GeeksForGeeks, 2025b. findByIdAndDelete Method in Mongoose. [Online]. Avaialble at: https://www.geeksforgeeks.org/mongodb/mongoose-findbyidanddelete-function/
Ghorbanian, A and Postal, C. 22 September 2022. How To Secure React Applications Against XSS Attacks with HTTP-Only Cookies. [Online]. Available at: <https://www.digitalocean.com/community/tutorials/how-to-secure-react-applications-against-xss-attacks-with-http-only-cookies> [Accessed 9 October 2025]
    

*/