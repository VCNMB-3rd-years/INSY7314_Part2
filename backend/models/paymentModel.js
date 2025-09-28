//amount, currency, provider SWIFT
const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({ //define layout of a paymentt object
    customerName: {type: String, required: true},
    amount: {type: Number, required: true},
    currency: {type: String, required: true},
    provider: {type: String, required: true},
    verified: {type: Boolean, required: true}
})

const Payment = mongoose.model('Payment', paymentSchema) //link payment layout ot db

module.exports = Payment //rest of app gains access to this export