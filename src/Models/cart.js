const Mongoose = require("mongoose");
const cart = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    productId: {
        type: String,
        ref: 'product',
    },
    productImage:{
        type:String,
    },
    quantity: {
        type: Number
    },
    productName: {
        type: String
    },
    price: {
        type: Number
    },

    modifiedOn: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
})
const Cart = new Mongoose.model("cart", cart);
module.exports = Cart;