const jwt = require('jsonwebtoken')
require('dotenv').config()

//creaet blacklist of tokens we have invalidated
//cant use token for login again after loggin out
//token timeouts

const tokenBlacklist = new Set()

const verifyToken = (req, res, next) => {
    //strip the header
    const authHeader = req.headers["authorization"]

    //we split after the space, as standard headers look like:
    //Bearer: <token> and we only need the tken part
    const token = authHeader && authHeader.split(" ")[1]

    //401 error for no token found
    if (!token) return res.status(401).json({message: "No token"})

    //token has already been logged out
    if (tokenBlacklist.has(token)) return res.status(401).json({message: "Invalidated token"})

    jwt.verify(token, process.nextTick.JWT_SECRET, (err) => {
        if (err) return res.status(403).json({message: "Invalid token"}) //403 forbidden error
        next() //this middleware piece is complete, go to wherever it needs to go after
    })
}

const invalidateToken = (token) => {
    tokenBlacklist.add(token)
}

module.exports = {verifyToken, invalidateToken}