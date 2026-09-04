const mongoose = require('mongoose');

const mongodbConnect = async () =>{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected success.")
}

module.exports = mongodbConnect;
