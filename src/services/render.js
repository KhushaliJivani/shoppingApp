const { addUser } = require("../Controller/controller");

exports.homeRoutes=(req,res)=>{
    res.render('index');
}
exports.register=(req,res)=>{
    res.render('registerUser');
}

exports.loginUser=(req,res)=>{
    res.render('login');

}

exports.productPage=(req,res)=>{
    res.render('product');   
}

exports.productDetail=(req,res)=>{
    res.render('productDetail');
}

exports.addProduct=(req,res)=>{
    res.render('add');
}

exports.buy=(req,res)=>{
    res.render('buy');
}

exports.history=(req,res)=>{
    res.render('history');
}