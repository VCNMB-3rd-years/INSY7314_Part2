const express = require('express')
const {register, login, logout} = require('../controllers/authController.js')

const router = express.Router()

//posts because the username and password are required
router.post('/login', login)
router.post('/register', register)


module.exports = router