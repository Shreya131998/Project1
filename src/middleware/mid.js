const blogsModel = require("../models/blogsModel")

let jwt=require("jsonwebtoken")

const authenticate=async function(req,res,next){
    try{
       
        let token = req.headers["x-api-key"]
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
        
        let decodedToken = jwt.verify(token, 'Project1')
        
        if(decodedToken){
            req.authorId=decodedToken.userId
            
            next()
        }
        else{
            return res.status(403).send({status:false,message:"Invalid authentication"})
        }
    }
    
        


    

catch(err){
    return res.status(500).send({msg:err.message})
}


}



module.exports.authenticate=authenticate

