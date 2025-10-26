const Admin = require('../models/adminModel.js')
const generateJwt = require('../controllers/authController.js')
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
       const isSuperAdmin = (privilege === true || privilege === 'true');
        if (isSuperAdmin) {
            const superAdminExists = await Admin.findOne({ privilege: true });
            if (superAdminExists) {
                return res.status(400).json({ message: "A Super Admin already exists. Cannot create another." });
            }
        }

        //This is just the regular admin
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
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

//Login of a Employee 
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
        delete safeAdmin.privilege;

        const token = generateJwt({
            id: adminData._id,
            username: adminData.username,
            privilege: adminData.privilege // Include privilege in the token payload
        },
        "admin");

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

module.exports = {
    registerAdmin,
    loginAdmin,
    logout
}