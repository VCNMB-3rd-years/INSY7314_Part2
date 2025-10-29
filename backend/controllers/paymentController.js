const xss = require('xss') //npm i xss for protection
const validator = require('validator');
const Payment = require('../models/paymentModel.js') //connect model to controller

//CREATE PAYMENT (post)
const createPayment = async(req, res) => {
    const {customerName, customerAcc, amount, currency, provider, swiftCode} = req.body //collect input from frontend form

    //ensure someone is logged in when they naviagte to the payment page
    if (!req.user || !req.user.payload.fullName || !req.user.payload.accNumber) {
        return res.status(401).json({message: "You muts be logged in to make a payment"}) //401 forbidden if not logged in
    }

    if (!customerName || !customerAcc || !amount || !currency || !provider || !swiftCode) { //check for nulls in payment fields and double check a user is logged in
        return res.status(400).json({message: "Please ensure all required fields are filled out"})
    }

    const sanitizedName = xss(validator.escape(customerName?.toString() || ''))
    const sanitizedAmount = parseFloat(amount)
    const sanitizedProvider = xss(validator.escape(provider?.toString() || ''))
    const sanitizedCurrency = xss(validator.escape(currency?.toString() || ''))
    const sanitizedSwiftCode = xss(validator.escape(swiftCode?.toString() || ''))
    const sanitizedAccNumber = xss(validator.escape(customerAcc?.toString() || ''))

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
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
        return res.status(400).json({message: "Amount must be a postive whole number"})
    }

    if (!validator.matches(sanitizedCurrency, /^[A-Z]{3}$/)) {
        return res.status(400).json({ message: "Currency should be the 3 initials of the currency name" });
    }

    if (!validator.matches(sanitizedProvider, /^[a-zA-Z0-9\s]+$/)) {
        return res.status(400).json({ message: "Provider must only contain letters, numbers, and spaces" });
    }

    if (!validator.matches(sanitizedSwiftCode, /^([a-zA-Z]{4})[-\s]?([a-zA-Z]{2})[-\s]?([0-9a-zA-Z]{2})([-\s]?[0-9a-zA-Z]{3})?$/)) { //(Klesun, 2024)
        return res.status(400).json({ message: "Swift Code format must follow: AAAA-BB-CC-123)." });
    }

    if (req.user.payload.fullName !== sanitizedName || req.user.payload.accNumber !== sanitizedAccNumber) {
        return res.status(403).json({message: "Customer details don't match logged in user credentials" })
    }

    //when payment is created, default to pending status
    try {
        const payment = await Payment.create({
            customerName: sanitizedName, 
            customerAcc: sanitizedAccNumber,
            amount: sanitizedAmount, 
            currency: sanitizedCurrency.toUpperCase(), 
            provider: sanitizedProvider.toUpperCase(), 
            swiftCode: sanitizedSwiftCode.toUpperCase(),
            verified: "PENDING"}) //create the payment object with THE SANITIZED INPUTS

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

    if (!req.user.role === 'employee') {
        return res.status(401).json({message: "Only employees have access to this page"})
    }

    //INPUT SANITISING FOR XSS ATTACKS
    customerName = xss(customerName)
    currency = xss(currency)
    provider = xss(provider)

    try {
        const payment = await Payment.findByIdAndUpdate(id, {verified: "VERIFIED"}, {new: true}) //find the payment from the db and update where verified field updates

        if (!payment) { //payment not found
            return res.status(404).json({message: "There is no payment here"})
        }
        
        return res.status(202).json(payment) //return the updated payment
    }
    catch (error) {
        res.status(500).json({error: error.message}) //if anythign goes wrong, return eror detauls
    }
}

//REJECT PAYMENT (put)
const rejectPayment = async(req, res) => {
    const id = req.params.id
    let {customerName, amount, currency, provider, verified} = req.body //pull payment object from frontend

    if (!req.user.role === 'employee') {
        return res.status(401).json({message: "Only employees have access to this page"})
    }

    //INPUT SANITISING FOR XSS ATTACKS
    customerName = xss(customerName)
    currency = xss(currency)
    provider = xss(provider)

    try {
        const payment = await Payment.findByIdAndUpdate(id, {verified: "REJECTED"}, {new: true}) //find the payment from the db and update where verified field updates

        if (!payment) { //payment not found
            return res.status(404).json({message: "There is no payment here"})
        }
        
        return res.status(202).json(payment) //return the updated payment
    }
    catch (error) {
        res.status(500).json({error: error.message}) //if anythign goes wrong, return eror detauls
    }
}

//VIEW ALL CURRENT CUSTOMER PAYMENTS (get)
const getCustomerPayments = async(req, res) => {
    try {
        //ensure someone is logged in when they naviagte to the payment page
        if (!req.user || !req.user.payload.fullName || !req.user.payload.accNumber) {
            return res.status(401).json({message: "You muts be logged in to make a payment"}) //401 forbidden if not logged in
        }
        const payments = await Payment.find({customerName: req.user.payload.fullName, customerAcc: req.user.payload.accNumber}) //pulls all objects in payment node in db that belong to that user
        return res.status(200).json(payments)
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

//VIEW ALL PENDING PAYMENTS (get)
const getPendingPayments = async(req, res) => {
    try {
        // if (req.user.payload.role !== 'employee') {
        //     return res.status(401).json({message: "Only employees have access to this page"})
        // }
        const payments = await Payment.find({verified: "PENDING"}) //pulls all objects in payment node in db
        return res.status(200).json(payments)
    }
    catch (error) {        
        return res.status(500).json({error: error.message})
    }
}

//VIEW ALL PAST PAYMENTS (get)
const getProcessedPayments = async(req, res) => {
    try {
        // if (req.user.payload.role !== 'employee') {
        //     return res.status(401).json({message: "Only employees have access to this page"})
        // }
        const payments = await Payment.find(!{verified: "PENDING"}) //pulls all objects in payment node in db that have been processed before
        return res.status(200).json(payments)
    }
    catch (error) {        
        return res.status(500).json({error: error.message})
    }
}

//TESTING PURPOSES
const deleteAllPayments = async (req, res) => {
    try {
        await Payment.deleteMany({});
        return res.status(200).json({ message: 'All payments have been deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPayment, 
    verifyPayment,
    rejectPayment,
    getPendingPayments,
    getProcessedPayments,
    getCustomerPayments,
    deleteAllPayments
}

/*
REFERENCES:
    Klesun. 28 June 2024. What is proper RegEx expression for SWIFT codes? [Online]. Available at: <https://stackoverflow.com/questions/3028150/what-is-proper-regex-expression-for-swift-codes> [Accessed 9 October 2025]
    W3Schools. 2025. RegExp Character Classes. [online]  available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
*/