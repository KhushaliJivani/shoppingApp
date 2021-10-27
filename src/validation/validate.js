
const joi=require("joi");
exports.validationReg=(req,res,next)=>{
    const name=req.body.name;
    const contact=req.body.number;
    const email=req.body.email
    const password=req.body.psw;
    const file=req.file;
 
    const schema=joi.object({
        name:joi.string().min(3).max(15).required(),
        email:joi.string().email().min(5).max(50).required(),
        psw:joi.string().min(5).alphanum().max(10).required(),
        number:joi.string().min(10).required(),
        file:joi.string().required(),
    })
   let result= schema.validate(req.body);
    console.log(result);
   if(result.error){
         res.status(400).send(result.error.details[0].message);
         return;
   }
   res.send(result);
   //next();
}


exports.validationLogin=(req,res,next)=>{
    const schema=joi.object().keys({
        email:joi.string().email().min(5).max(50).required(),
        psw:joi.string().min(5).max(10).required(),
        
    })
    let resultLogin= schema.validate(req.body);
    // console.log(result);
     if(resultLogin.error){
           res.status(400).send(resultLogin.error.details[0].message);
           return;
     }
     next();
}


exports.validationAddProduct=(req,res,next)=>{
    const schema=joi.object().keys({
        pname:joi.string().min(3).max(20).required(),
        price:joi.number().required(),
        quantity:joi.number().min(5).required(),
        myproduct:joi.string().required(),
    })
    let resultAddProduct=schema.validate(req.body);
    if(resultAddProduct.error){
        res.status(400).send(resultAddProduct.error.details[0].message);
        return;
    }
    res.send(resultAddProduct);

}