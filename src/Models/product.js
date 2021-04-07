const Mongoose = require("mongoose");

const product=new Mongoose.Schema({
    userId:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    productName:{
        type:String,
    },
    productPrice:{
        type:Number,
    },
    quantity:{
        type:Number,
    }

})
const Product=new Mongoose.model("product",product);
module.exports=Product;