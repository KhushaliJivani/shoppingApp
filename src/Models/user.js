const Mongoose  = require("mongoose");
const bcrypt=require("bcryptjs");
//const jwt=require("jsonwebtoken");
const userSchema=new Mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobileNo:{
        type:Number,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
},
{
    timestamps:true,
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})
const Register=new Mongoose.model("User",userSchema);
module.exports=Register;