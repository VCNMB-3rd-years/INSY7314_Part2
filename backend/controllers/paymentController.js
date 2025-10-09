const xss = require('xss') //npm i xss for protection
const validator = require('validator');
const Payment = require('../models/paymentModel.js') //connect model to controller

//CREATE PAYMENT (post)
const createPayment = async(req, res) => {
    const {customerName, amount, currency, provider} = req.body //collect input from frontend form

    //ensure someone is logged in when they naviagte to the payment page
    if (!req.user) {
        return res.status(401).json({message: "You muts be logged in to make a payment"}) //401 forbidden if not logged in
    }

    if (!customerName || !amount || !currency || !provider) { //check for nulls in payment fields and double check a user is logged in
        return res.status(400).json({message: "Please ensure all required fields are filled out"})
    }

    const sanitizedName = xss(validator.escape(customerName?.toString() || ''))
    const sanitizedAmount = parseFloat(amount)
    const sanitizedProvider = xss(validator.escape(provider?.toString() || ''))
    const sanitizedCurrency = xss(validator.escape(currency?.toString() || ''))

    //sanitize user entered date (customer info)
    if (!validator.matches(sanitizedName, /^[a-zA-Z0-9\s]+$/)) {
        return res.status(400).json({ message: "Full name must contain only letters, numbers, and spaces" });
    }
    if (!validator.isLength(sanitizedName, { min: 3, max: 30 })) {
        return res.status(400).json({ message: "Full name must be between 3 and 30 characters" });
    }
    if (!validator.matches(sanitizedAccNumber, /^acc\d{9}$/)) {
        return res.status(400).json({ message: "Account number must start with 'acc' followed by exactly 9 digits" });
    }

    //sanitize payment date (payment details entered)
    if (!validator.isCurrency(sanitizedAmount.toString(), {allow_negatives: false})) {
        return res.status(400).json({message: "Amount must be a postive whole number"})
    }

    if (!validator.matches(sanitizedCurrency, /^[A-Z]{3}$/)) {
        return res.status(400).json({ message: "Currency should be the 3 initials of the currency name" });
    }
    if (!validator.matches(sanitizedProvider, /^[a-zA-Z0-9\s]+$/)) {
        return res.status(400).json({ message: "Provider must only contain letters, numbers, and spaces" });
    }

    if (req.user.fullName !== sanitizedName || req.user.accNumber !== sanitizedAccNumber) {
        return res.status(403).json({message: "Customer details don't match logged in user credentials" })
    }

    try {
        const payment = await Payment.create({
            customerName: sanitizedName, 
            amount: sanitizedAmount, 
            currency: sanitizedCurrency, 
            provider: sanitizedProvider, 
            verified: false}) //create the payment object with THE SANITIZED INPUTS

        return res.status(201).json({message: "Payment created successfully.", payment: payment}) //returnt that the object was created and logged in db
    }
    catch (error) {
        return res.status(500).json({error: error.message}) //if soemthing goes wrong, return eror details
    }
}

//VERIFY PAYMENT (put)
const verifyPayment = async(req, res) => {
    const id = req.params.id
    let {customerName, amount, currency, provider, verified} = req.body //pull payment object from frontend

    //INPUT SANITISING FOR XSS ATTACKS
    customerName = xss.customerName
    currency = xss.currency
    provider = xss.provider

    try {
        const payment = await Payment.findByIdAndUpdate(id, {verified}, {new: true}) //find the payment from the db and update where verified field updates

        if (!payment) { //payment not found
            return res.status(404).json({message: "There is no payment here"})
        }
        
        return res.status(202).json(payment) //return the updated payment
    }
    catch (error) {
        res.status(500).json({error: error.message}) //if anythign goes wrong, return eror detauls
    }
}

//VIEW ALL PENDING PAYMENTS (get)
const getPendingPayments = async(req, res) => {
    try {
        const payments = await Payment.find({verified: false}) //pulls all objects in payment node in db
        return res.status(200).json(payments)
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = {
    createPayment, 
    verifyPayment,
    getPendingPayments
}