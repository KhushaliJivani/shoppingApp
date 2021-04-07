const express = require("express");
const path = require("path");
const dotenv=require('dotenv');
dotenv.config();
var bodyParser=require("body-parser");
const bcrypt=require("bcryptjs");
const app = express();

require("./database/connection");
const register = require("./Models/user");
const product = require("./Models/product");
const orderproduct = require("./Models/orderProduct");

const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");
app.use(express.static(staticPath));
app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/register', (req, res) => {
    res.render('registerUser');
})
app.use(bodyParser.json());
//app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/register', async (req, res) => {
    letuserPassword=req.body.psw;
    let password = await bcrypt.hash(userPassword, 10);
    try {
        const registerUser = new register({
            name: req.body.name,
            email: req.body.email,
            mobileNo: req.body.number,
            password: req.body.psw,
        })
        //password hash
        const registered=await registerUser.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
    }

})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    try {
        // console.log(req.body.name);
        const email=req.body.email;
        const password=req.body.psw;

        const userLogin=await register.findOne({email:email});
        const isMatch=await bcrypt.compare(password,userLogin.password);
        if(isMatch){
            res.status(201).render("product",{userId:userLogin._id});
        }else{
            res.send("invalid login");
        }
        
    } catch (error) {
        res.status(400).send("invalid login");
    }

})

app.get('/productDetail',(req,res)=>{
    res.render('productDetail');
})
// app.post('/productDetail',async(req,res)=>{
//     try{


//     }
//     catch(error){
//         res.status(400).send(error);
//     }
// })

app.get('/add',(req,res)=>{
    res.render('add');
})

app.post('/add',async(req,res)=>{
    try {
        // console.log(req.body.name);
        const addProduct = new product({
            // userId:userLogin._id,
            userId:req.para,
            productName: req.body.pname,
            productPrice: req.body.price,
            quantity: req.body.quantity,
            
        })
        //password hash
        const productList=await addProduct.save();
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
    }
})


app.use((req, res) => {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log(`server running on ${port}`);
})