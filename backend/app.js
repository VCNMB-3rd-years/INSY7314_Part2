const express = require('express')
require('dotenv').config()
const port = process.env.API_PORT || 3002 //default value passed if env file doesnt render
const {connectToMongo} = require('./services/dbService.js') //to connect to db
const paymentRoutes = require('./routes/paymentRoutes.js')
const customerRoutes = require('./routes/customerRoutes.js')
const employeeRoutes = require('./routes/employeeRoutes.js')
const {securityMiddleware} = require('./middleware/securityMiddleware.js')
const https = require('https') //For the SSL certificate
//fs is for file system
const fs = require('fs')


//creating new variables so that it can hold the certifacte place of home
const options = {
    key: fs.readFileSync('./certs/localhost+1-key.pem'),
    cert: fs.readFileSync('./certs/localhost+1.pem')
}

const app = express() //runs express with default parameters

app.use(express.json()) //interpret json communication throughout

securityMiddleware(app) //wrap app in security middleware

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`) //print method requests and url
    next(); //proceed ot next incoking request
})

app.use('/v1/payments', paymentRoutes) //version the api and call in functionality from payment routes
app.use('/v1/customer', customerRoutes)
app.use('/v1/employee', employeeRoutes)
connectToMongo() //connect to db

//COMMNETED OUT FOR THE SSL CERTIFICATE
//app.listen(port, () => {
  //  console.log(`API is listening on port ${port}`) //prints out where api is connected to in the internet
//})

//NEW PORT FOR SSL
/*The https library to create a secure listener
take options so that it knows where the privat ekey and certifcate is living 
then it runs our the express app, in the chosen port and where to print it out
-- npm i https
*/

https.createServer(options, app).listen(port, () => {
    console.log(`The API is now SECURLEY LISTENING on port ${port}.`)
})

