const express = require('express')
require('dotenv').config()
const port = process.env.API_PORT || 3002 //default value passed if env file doesnt render
const {connectToMongo} = require('./services/dbService.js') //to connect to db
const paymentRoutes = require('./routes/paymentRoutes.js')
const {securityMiddleware} = require('./middleware/securityMiddleware.js')

const app = express() //runs express with default parameters

app.use(express.json()) //interpret json communication throughout

securityMiddleware(app) //wrap app in security middleware

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`) //print method requests and url
    next(); //proceed ot next incoking request
})

app.use('/v1/payments', paymentRoutes) //version the api and call in functionality from payment routes

connectToMongo() //connect to db

app.listen(port, () => {
    console.log(`API is listening on port ${port}`) //prints out where api is connected to in the internet
})
