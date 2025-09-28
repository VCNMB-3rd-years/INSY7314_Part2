//
const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({ //define layout of an employee object
    username: {type: String, required: true},
    password: {type: String, required: true}
})

const Employee = mongoose.model('Employee', employeeSchema) //link employee layout ot db

module.exports = Employee //rest of app gains access to this export