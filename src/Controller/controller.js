var user = require('../Models/user');
var product = require('../Models/product');
var orderProduct = require('../Models/orderProduct');
require("../routes/router");
const bcrypt = require("bcryptjs");
let id;
exports.addUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "content can not be empty!!"
        });
        return;
    }
    try {

        let userPassword = req.body.psw;
        let password = await bcrypt.hash(userPassword, 10);

        const registerUser = new user({
            name: req.body.name,
            email: req.body.email,
            mobileNo: req.body.number,
            password: req.body.psw,
        })
        const registered = await registerUser.save();
        res.status(201).render('login');
    } catch (error) {
        res.status(400).send(error);
    }

}
exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.psw;
        const userLogin = await user.findOne({
            email: email
        });
        id = userLogin._id;

        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (isMatch) {
            res.status(201).render('product');
        } else {
            res.send("invalid login");
        }

    } catch (error) {
        res.status(400).send("invalid login");
    }
}
exports.addProduct = async (req, res) => {
    try {

        const addProduct = new product({
            userId: id,
            productName: req.body.pname,
            productPrice: req.body.price,
            quantity: req.body.quantity,
        })
        const productList = await addProduct.save();
        res.status(201).render('product');
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.find = async (req, res) => {
    const products = await product.find({});
    res.render('productDetail', {
        products
    });
}

exports.buyProduct = async (req, res) => {
    const buyProductId = req.params.id;
    const products = await product.findOne({
        _id: buyProductId
    });
    res.render('buy', {
        products
    });
}

exports.orderProduct = async (req, res) => {
    const oId = req.params.id;
    try {
        const pid = await product.findOne({
            _id: oId
        });
        const productId = pid._id;
        const priceForOne = pid.productPrice;
        const productName = pid.productName;
        const total = priceForOne * req.body.quantity;


        if (req.body.quantity <= pid.quantity) {
            const orderedProduct = new orderProduct({
                productId: productId,
                orderProductName: productName,
                userId: id,
                totalPrice: total,
                orderedQuantity: req.body.quantity,
            })
            const ordered = await orderedProduct.save();
            const finalQuantity = pid.quantity - req.body.quantity;
            const result = product.updateOne({
                _id: pid
            }, {
                $set: {
                    quantity: finalQuantity
                }
            });
            res.status(201).send('Thank you for shopping...');
        } else {
            res.send("sorry quantity not available..");
        }
    } catch (error) {
        res.status(400).send(error);
    }
}


exports.historyProduct = async (req, res) => {
    console.log(id);
    const orderProducts = await orderProduct.find({
        userId: id
    });
    res.render('history', {
        orderProducts
    });
}

exports.editProduct = async (req, res) => {
    let pid = req.params.id;
    let id = await product.findOne({
        _id: pid
    });
    res.render('editAdd', {
        id
    });
}

exports.deleteUser = async (req, res) => {
    let pid = req.params.id;
    let id = await product.deleteOne({
        _id: pid
    });
    res.render('product');

}
exports.editAdd = async (req, res) => {
    const productId = req.body._id;
    try {
        let editProduct = await product.updateOne({
            _id: productId
        }, {
            $set: {
                productName: req.body.pname,
                quantity: req.body.quantity,
                productPrice: req.body.price
            }
        })
        res.status(201).render('product');
    } catch (error) {
        res.status(400).send(error);
    }
}