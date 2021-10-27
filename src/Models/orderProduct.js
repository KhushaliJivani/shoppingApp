const Mongoose = require("mongoose");
const orderProduct = new Mongoose.Schema({
    productId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    orderProductName:{
        type:String,
    },
    orderProductImage:{
        type:String,
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    totalPrice: {
        type: Number,
    },
    orderedQuantity: {
        type: Number,
    },
})
const Order = new Mongoose.model("Order", orderProduct);
module.exports = Order;