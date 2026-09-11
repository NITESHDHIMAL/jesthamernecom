const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: [ 'normal_user', 'admin'],
        default:'normal_user'
    }
})

// hash the password before saving 
userSchema.pre( "save",   async function(){
    if(!this.isModified){
        return
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt)
})

// compare entered password with hashed password 
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


const User = mongoose.model("User", userSchema);
module.exports = User;

