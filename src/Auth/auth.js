const jwt=require("jsonwebtoken");


exports.authenticateToken=(req,res,next)=>{
    var token=req.headers["authorization"];
    if(!token){
        res.status(401).send({auth:false,message:'no token is there'});
    }
    jwt.verify(token,"mynameiskhushalibharatbhaijivaniviitorcloud",function(err,decoded){
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        var decoded = jwt.decode(token, {complete: true});  
       // res.status(200).send(decoded);
        next();
    })
    
}

