const jwt = require('jsonwebtoken')
require('dotenv').config()

const tokenBlacklist = new Set() //stores tokens that have already been used to prevent session jacking

const verifyToken = (req, res, next) => {
    //strip the header
    const authHeader = req.headers["authorization"]

    //we split after the space, only need the token part
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