const Admin = require('../models/adminModel.js')
const Employee = require('../models/employeeModel.js')
const { generateJwt } = require('../controllers/authController.js')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { invalidateToken } = require('../middleware/authMiddleware.js')

//Registration of a Admin (post)
const registerAdmin = async (req, res) => {
    //Information needed for registration
    try {
        const {
            username,
            password,
            privilege
        } = req.body

        //Error handeling > make sure that user enters all the information in the input boxs/fields stuff
        if (!username || !password) {
            return res.status(400).json({ message: "Enter all the fields please" })
        }

        //Checks if MAIN admin exists
       
        if (privilege === true) {
            //GeeksForGeeks, 2025. 
            const superAdminExists = await Admin.findOne({ privilege: true });
            if (superAdminExists) {
                return res.status(400).json({ message: "A Super Admin already exists. Cannot create another." });
            }
        }

        //This is just the regular admin
        //GeeksForGeeks, 2025
        if (await Admin.findOne({ username })) {
            return res.status(400).json({ message: "Admin username already exists." });
        }


        //Create a new Admin
        const createdAdmin = await Admin.create(
            {
                username,
                password,
                privilege
            })

        const safe = createdAdmin.toObject ? createdAdmin.toObject() : createdAdmin;
        delete safe.password;
        return res.status(201).json({ message: "Admin registered", admin: safe });


    }
    catch (error) {
        return res.status(500).json({ error: "Server error during registration." })
    }
}

//Login of an admin
const loginAdmin = async (req, res) => {
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
        const adminData = await Admin.findOne({ username }).select('+password +privilege'); 
        if (!adminData) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // using matchPassword to mathc password to the one in the db
        const isMatch = await adminData.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        } // check customerController.js's login endpoint for why both say invalid credentials

        // (Gyawali, 2024)
        const safeAdmin = adminData.toObject ? adminData.toObject() : adminData;
        delete safeAdmin.password;

        const token = generateJwt({
            id: adminData._id,
            username: adminData.username,
            privilege: adminData.privilege // Include privilege in the token payload
        },
        "admin");

        res.cookie('token', token, { //(Ghorbanian and Postal, 2022)
                httpOnly: true, //javascript cant access the cookie so jwt is safe here (Ghorbanian and Postal, 2022)
                secure: true, // sends only over https 
                sameSite: 'Strict', //prevents crsf from different origins (Csarmiento. 8 April 2022)
                maxAge: 3 * 60 * 60 * 1000 //3 hours until expiratiaon (Csarmiento. 8 April 2022)
        })

        return res.status(200).json({ message: "Admin has login successfully", admin: safeAdmin, token: token});
    }
    catch (error) {
        console.error(' Admin Login error:', error);
        return res.status(500).json({ message: "Server error during Admin login" });
    }
}

//added so long, still need a button to connect to, maybe on portal and make payment screens?
const logout = async(req, res) => {
    //const authHeader = req.headers['authorization'] //strip header for token value
    //const token = authHeader.split(" ")[1]
    const token = req.cookies.token

    if (!token) { 
        return res.status(400).json({message: "You need to be logged in before you can log out"}) //check if there is a token, if not error
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

// delete a employee (Username)
const deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({message: "Only admin has access to this function"})
        }
        
        const { username } = req.body;

        // Validate input
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Sanitize username
        const sanitizedUsername = validator.escape(username?.toString() || '');

        // Find and delete the employee
        const employee = await Employee.findOneAndDelete({ username: sanitizedUsername });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Log deletion for auditing
        console.log(`Employee ${sanitizedUsername} deleted by admin ${req.user.username}`);
        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error('Delete employee error:', error);
        return res.status(500).json({ message: "Server error during employee deletion" });
    }
};

//gets admin details to know who it is
const loggedAdmin = async (req, res) => {
    try {
        return res.status(200).json({
            role: req.user.role,
            payload: req.user.payload
        });
    } catch (error) {
        console.error('Get admin info error:', error);
        return res.status(500).json({ message: "Server error getting admin data" });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    logout,
    deleteEmployee,
    loggedAdmin
}


/*
REFERENCES
====================
GeeksForGeeks, 2025. MongoDB - FindOne() Method. [Online]. Available at: https://www.geeksforgeeks.org/mongodb/mongodb-findone-method/


*/