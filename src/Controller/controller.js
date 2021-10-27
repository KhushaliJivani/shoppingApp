var user = require('../Models/user');
var product = require('../Models/product');
var orderProduct = require('../Models/orderProduct');
var cart = require('../Models/cart');
const fs=require('fs');
var path=require('path');
require("../routes/router");
const bcrypt = require("bcryptjs");
const buffer=require('buffer');
const multer=require('multer');
let uId;

exports.addUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "content can not be empty!!"
        });
        return;
    }
    try {
        let userPassword = req.body.psw;
        //let password = await bcrypt.hash(userPassword, 10);
        const file=req.file;
        // console.log(file);
        // let data=await fs.readFile(path.join('G:/Task/shoppingApp/image/'+req.body.img),function(err,data){
        //     if(err){
        //         throw err;
        //     }
        //     else{
        //         let base64 = data.toString('base64');
                 const registerUser = new user({
                    name: req.body.name,
                    email: req.body.email,
                    mobileNo: req.body.number,
                    password: req.body.psw,
                    image:file.path,
        
                })
                const registered = registerUser.save();
            //}
        //});
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
        uId = userLogin._id;
        const regUserData=await user.findOne({_id:uId});
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (isMatch) {
            res.render('product', {
                regUserData
            });
        } else {
            res.send("invalid login");
        }

    } catch (error) {
        res.status(400).send("invalid login");
    }
}
exports.addProduct = async (req, res) => {
    try {
        
        let data=await fs.readFile(path.join('G:/Task/shoppingApp/image/'+req.body.myproduct),function(err,data){
            if(err){
                throw err;
            }else{
                let base64=data.toString('base64');
                const buffer=Buffer.from(base64,"base64");
                let productImgPath =`./uploads/products/${req.body.myproduct}`;
                fs.writeFileSync(productImgPath, buffer);
                const addProduct = new product({
                    userId: uId,
                    productName: req.body.pname,
                    productPrice: req.body.price,
                    quantity: req.body.quantity,
                    productImage:req.body.myproduct,

                })
                const productList = addProduct.save();
            }
        })
    const regUserData=await user.findOne({_id:uId});
    res.render('product',{regUserData});
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
        const prodImage=pid.productImage;

        if (req.body.quantity <= pid.quantity) {
            const orderedProduct = new orderProduct({
                productId: productId,
                orderProductName: productName,
                orderProductImage:prodImage,
                userId: uId,
                totalPrice: total,
                orderedQuantity: req.body.quantity,
            })
            const ordered = await orderedProduct.save();
            const finalQuantity = pid.quantity - req.body.quantity;
            const result = await product.updateOne({
                _id: productId
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
    const orderProducts = await orderProduct.find({
        userId: uId
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
    const regUserData=await user.findOne({_id:uId});
    res.render('product',{regUserData});
}
exports.editAdd = async (req, res) => {
    const productId = req.body._id;
    try {
        let data=await fs.readFile(path.join('G:/Task/shoppingApp/image/'+req.body.myProduct),async function(err,data){
            // if(err){
            //     throw err;
            // }else{ 
                let base64=data.toString('base64');
                const buffer=Buffer.from(base64,"base64");
                let productImgPath =`./uploads/products/${req.body.myProduct}`;
                fs.writeFileSync(productImgPath, buffer);    
        let editProduct = await product.updateOne({
            _id: productId
        }, {
            $set: {
                productName: req.body.pname,
                quantity: req.body.quantity,
                productPrice: req.body.price,
                productImage:req.body.myProduct,
            }
        })
    })
         const regUserData=await user.findOne({_id:uId});
        res.render('product',{regUserData});
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.cart = async (req, res) => {
    const cartProductId = req.params.id;
    const products = await product.findOne({
        _id: cartProductId
    });
    res.render('cart', {
        products
    });
}


exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const quantity=req.body.quantity;
    const productData = await product.findOne({
        _id: productId
    });
    if (req.body.quantity <= productData.quantity) {
    try {
        const takeUserId=uId;
        const cartProductId = req.params.id;
        const cartUserId = uId;
        const quantity = req.body.quantity;
        const products = await product.findOne({
            _id: cartProductId
        });
        const getAvailableItem=await cart.findOne({productId:cartProductId})
        if(getAvailableItem){
            const firstQuantity=getAvailableItem.quantity;
            const totalQuantity=parseInt(firstQuantity)+parseInt(quantity);
            if(totalQuantity<=productData.quantity)
            {
                const sameItemUpdate=await cart.updateOne({productId:cartProductId},{$set:{quantity:totalQuantity}});
            }else{
                res.send("sorry no quantity available..");
            }
        }
        else{
        const cartData=new cart({
            userId:takeUserId,
            productId:cartProductId,
            quantity:quantity,
            productImage:products.productImage,
            productName:products.productName,
            price:products.productPrice,
        
        })
        const add=await cartData.save();
    }
    const dispCart=await cart.find({userId:uId});
        res.status(500);
        res.render('displayCart',{dispCart});

}catch(err){
    console.log(err);
}
    }
    else{
        res.send("sorry quantity not available..");
    }
}

exports.removeFromCart = async (req, res) => {
    let cartId = req.params.id;
    let deleted = await cart.deleteOne({
        _id: cartId
    });
    const dispCart=await cart.find({userId:uId});
    res.status(201);
    res.render('displayCart',{dispCart});

}

exports.editCart = async (req, res) => {
    const cartId = req.params.id;
    const quantity=req.body.quantity;
    const cartData = await cart.findOne({
        _id: cartId
    });
    const productId=cartData.productId;
    const productData = await product.findOne({
        _id: productId
    });
    if (req.body.quantity <= productData.quantity) {
    try {
        let editCart = await cart.updateOne({
            _id: cartId
        }, {
            $set: {
                quantity: quantity
            }
        })
        const dispCart=await cart.find({userId:uId});
    res.status(201);
    res.render('displayCart',{dispCart});
    } catch (error) {
        res.status(400).send(error);
    }
}
else{
    res.send("sorry quantity not available..");
}
}

let totalOrderedPrice=0;
exports.buyCart = async (req, res) => {
    try {
        const cartData = await cart.find({
            userId:uId
        });

        cartData.forEach(cartData=>{
            let quantity=cartData.quantity;
            let price=cartData.price;
            let totalQuantityPrice=parseInt(quantity)*parseInt(price);
            totalOrderedPrice+=totalQuantityPrice;
                const orderedProduct = new orderProduct({
                productId: cartData.productId,
                orderProductName: cartData.productName,
                orderProductImage:cartData.productImage,
                userId: cartData.userId,
                totalPrice: parseInt(totalQuantityPrice),
                orderedQuantity: cartData.quantity,
            })
            const ordered = orderedProduct.save();
        }) 
        for(let data of cartData){
            const cartQuantity=data.quantity;
                const pid =await product.findOne({
                    _id: data.productId});
                    let finalQuantity = pid.quantity - data.quantity;
            const result =await product.updateOne({
                _id: data.productId
            }, {
                $set: {
                    quantity: finalQuantity
                }
            });
        }
        res.status(201);
        res.render('done',{totalOrderedPrice})

    } catch (error) {
        res.status(400).send(error);
    }
}


