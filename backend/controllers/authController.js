const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//helper method to generate tokens and stores some user details
//want to verify for payments that logged in user enters same details when creating the payment
//if tokens are stripped and details are extracted, compare it to enetred input on payment screen
const generateJwt = (payload, role) => {
    //signs it using the scret in env file
    return jwt.sign({
        payload, 
        role}, 
        process.env.JWT_SECRET, {
        expiresIn: "3h", //expiring in 3 hours from creatuion
    })
}

module.exports = generateJwt