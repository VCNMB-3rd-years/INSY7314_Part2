const jwt = require('jsonwebtoken')
require('dotenv').config()

//creaet blacklist of tokens we have invalidated
//cant use token for login again after loggin out
//token timeouts

const tokenBlacklist = new Set()

const verifyToken = (req, res, next) => {
    //strip the header
    // const authHeader = req.headers["authorization"]
    // console.log("Authorization Header:", authHeader) //debuggin

    //we split after the space, as standard headers look like:
    //Bearer: <token> and we only need the tken part
    //const token = authHeader && authHeader.split(" ")[1] //WITHOUT HTTP COOKIE
    const token = req.cookies.token //get token from within the cookies passed to here
    console.log("Extracted Token:", token)

    //401 error for no token found
    if (!token) { 
        return res.status(401).json({message: "No token found in cookie"})
    }
    //token has already been logged out
    if (tokenBlacklist.has(token)) {
        console.log(`Token ${token} is blacklisted`);
        return res.status(401).json({message: "Invalidated token"})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { 
            console.log("JWT Verification Error:", err)
            return res.status(403).json({message: "Invalid token"}) //403 forbidden error
        }

        req.user = decoded //extracts logged user details to verify who has access across the routes
        console.log("Decoded User:", req.user)
        next() //this middleware piece is complete, go to wherever it needs to go after
    })
}

const invalidateToken = (token) => {
    tokenBlacklist.add(token)
}



//Middleware for the admins
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role == 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access required." });
    }
}


const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role == 'admin' && req.user.payload.privilege == true) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Super Admin access required." });
    }
}



module.exports = {verifyToken, invalidateToken, isAdmin, isSuperAdmin}