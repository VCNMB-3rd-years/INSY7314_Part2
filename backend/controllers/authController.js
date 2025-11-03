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

const getCurrentUser = async (req, res) => {
  try {
    //req.user is attached by verifyToken middleware
    
    res.json({
      role: req.user.role,
      payload: req.user.payload || {}
    });
  } catch (err) {
    console.error('getCurrentUser error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateJwt, getCurrentUser }