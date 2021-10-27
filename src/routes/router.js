const express=require('express');
const route=express.Router();
const path=require('path');
const services=require('../services/render');
const controller=require('../Controller/controller');
const {upload}=require('../Helper/helper');


route.get('/',services.homeRoutes);

route.get('/register',services.register);

route.get('/login',services.loginUser);

route.get('/product',services.productPage);

route.get('/productDetail',services.productDetail);

route.post('/productDetail',controller.find);

route.get('/buy/:id',controller.buyProduct);

route.get('/editUser/:id',controller.editProduct);
 
route.post('/orderProduct/:id',controller.orderProduct);

route.get('/deleteUser/:id',controller.deleteUser);

route.get('/add',services.addProduct);

route.post('/register',upload.single('file'),controller.addUser);

route.post('/login',controller.login);

route.post('/add',controller.addProduct);

route.get('/history',services.history);

route.post('/history',controller.historyProduct);

route.post('/editAdd/:id',controller.editAdd);

route.get('/cart/:id',controller.cart);

route.post('/addToCart/:id',controller.addToCart);

route.get('/removeItemCart/:id',controller.removeFromCart);

route.post('/editCart/:id',controller.editCart);

route.get('/buy',controller.buyCart);

route.get('/done',services.done);

module.exports=route;



    