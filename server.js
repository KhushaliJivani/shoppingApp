const express=require('express');
const app=express();
const path = require("path");
const dotenv=require('dotenv');
dotenv.config();
const ejs=require('ejs');
require("./src/database/connection");
const port = process.env.PORT || 3000;
var bodyParser=require("body-parser");



app.use(express.json());
//app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

const staticPath = path.join(__dirname, "public/");
const viewsPath = path.join(__dirname, "views/");
app.use(express.static(staticPath));
app.set('views', viewsPath);
app.use('/',require('./src/routes/router'));
app.listen(port, () => {
    console.log(`server running on ${port}`);
})