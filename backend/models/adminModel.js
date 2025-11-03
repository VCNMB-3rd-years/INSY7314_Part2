const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({ //define layout of an employee object
    username: {type: String, required: true},
    password: {type: String, required: true, select: false}, //prevents password to be seen (Stack Overflow, 2012)
    privilege: { type: Boolean, default: false, select: false }
})


//(Kumar, 2024) Hashing user's password before entering mongoose
adminSchema.pre('save', async function(next) {
    //Hashes if password is new or has been updated
    if(!this.isModified('password'))
    {
        return next();
    }
    
    try{
        //Now SALT and HASH is generated
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
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
adminSchema.methods.matchPassword = async function(enterPassword)
{
     return await bcrypt.compare(enterPassword, this.password);
}


//const Employee = mongoose.model('Employee', employeeSchema) //link employee layout ot db

module.exports = mongoose.model('Admin', adminSchema); //rest of app gains access to this export