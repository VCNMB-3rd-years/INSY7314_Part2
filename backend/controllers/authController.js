const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel.js')
require('dotenv').config()

//helper method to generate tokens and takes in name
const generateJwt = (name) => {
    //signs it using the scret in env file
    return jwt.sign({name}, process.env.JWT_SECRET, {
        expiresIn: "3h", //expiring in 3 hours from creatuion
    })
}

module.exports(generateJwt)