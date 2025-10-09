const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { invalidateToken } = require('../middleware/authMiddleware.js')
const User = require('../models/userModel.js')
require('dotenv').config()

//helper method to generate tokens and takes in username
const generateJwt = (username) => {
    //signs it using the scret in env file
    return jwt.sign({username}, process.env.JWT_SECRET, {
        expiresIn: "3h", //expiring in 1 hour from creatuion
    })
}

module.exports(generateJwt)