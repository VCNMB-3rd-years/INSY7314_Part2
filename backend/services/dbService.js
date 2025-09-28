const mongoose = require('mongoose') //create an instance of mongoose to access the db
require('dotenv').config() //connect to env file to get connection string to db

//DB SETUP
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, { //gets connection string to connect online mongo
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database connected successfully")
    }
    catch (error) {
        console.error("Connection not established")
        process.exit(1) //close api if the db doesnt connect
    }
} 

module.exports = {connectToMongo}