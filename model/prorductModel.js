// const mongoose = require('mongoose');


// const productSchema = new mongoose.Schema({
//     title:String,
//     price:String,
//     description:String,
//     image:String
// })

// const Product = mongoose.model("Product", productSchema);

// module.exports = Product;




const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:Number,
    image:String,
    description:String
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
