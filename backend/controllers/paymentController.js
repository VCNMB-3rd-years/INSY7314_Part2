const xssProtect = require('xss') //npm i xss for protection
const Payment = require('../models/paymentModel.js') //connect model to controller

//CREATE PAYMENT (post)
const createPayment = async(req, res) => {
    let {customerName, amount, currency, provider} = req.body //collect input from frontend form

    //INPUT SANITISING FOR XSS ATTACKS
    customerName = xss.customerName
    currency = xss.currency
    provider = xss.provider

    if (!customerName || !amount || !currency || !provider) { //check for nulls in payment fields and double check a user is logged in
        return res.status(400).json({message: "Please ensure all required fields are filled out"})
    }

    try {
        const payment = await Payment.create({customerName, amount, currency, provider, verified: false}) //create the payment object 
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