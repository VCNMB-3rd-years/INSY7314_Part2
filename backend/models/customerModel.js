//full name, id, acc nr, password
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({ //define layout of a customer object
    fullName: {type: String, required: true},
    idNumber: {type: String, required: true},
    accNumber: {type: String, required: true},
    userPassword: {type: String, required: true}
})

const Customer = mongoose.model('Customer', customerSchema) //link customer layout ot db

module.exports = Customer //rest of app gains access to this export