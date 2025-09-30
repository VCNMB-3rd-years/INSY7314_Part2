//full name, id, acc nr, password
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const customerSchema = new mongoose.Schema({ //define layout of a customer object
    fullName: {type: String, required: true},
    idNumber: {type: String, required: true},
    accNumber: {type: String, required: true},
    userPassword: {type: String, required: true}
})

//(Kumar, 2024) Hashing user's password before entering mongoose
customerSchema.pre('save', async function(next) {
    //Hashes if password is new or has been updated
    if(!this.isModified('userPassword'))
    {
        return next();
    }
    
    try{
        //Now SALT and HASH is generated
        const salt = await bcrypt.genSalt(10);
        this.userPassword = await bcrypt.hash(this.userPassword, salt);
        //go forward to save
        next();
    }
    catch(error)
    {
        //Passes error 
        next(error);
    } 
})

//Comparison of the login password with hashed password (Bhupendra, 2024)

customerSchema.methods.matchPassword = async function(enterPassword)
{
     return await bcrypt.compare(enterPassword, this.userPassword);
}



const Customer = mongoose.model('Customer', customerSchema) //link customer layout ot db

module.exports = Customer //rest of app gains access to this export







/*
REFERENCES
==================
Bhupendra, 2024. Password Hashing using bcrypt. [Online] Available at: https://medium.com/@bhupendra_Maurya/password-hashing-using-bcrypt-e36f5c655e09 [Accessed 30 September 2025]
Kumar, A. 2024. Mastering User Authentication: Building a Secure User Schema with Mongoose and Bcrypt. [Online] Available at: https://medium.com/@finnkumar6/mastering-user-authentication-building-a-secure-user-schema-with-mongoose-and-bcrypt-539b9394e5d9 [Accessed 30 September 2025]
*/