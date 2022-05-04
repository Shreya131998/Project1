const authorModel= require("../models/authorModel")
const jwt=require("jsonwebtoken")

const isValid=function(value){
    if(typeof value==="undefined" || value===null)return false 
    if(typeof value==="string" && value.trim().length===0)return false 
    return true
}

const isValidTitle=function(title){
    return ["Mr","Miss","Mrs"].indexOf(title)!==-1
}
const isValidRequestBody=function(body){
    return Object.keys(body).length>0 
}

const createAuthor= async function (req, res) {
    try {
        let body = req.body
        if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:"Invalid request parameters please provide author details"})
        }
        
    
        const {fname,lname,title,email,password}=req.body
        if(!isValid(fname)){
            return res.status(400).send({status:false,message:"First name is required"})

        }
        if(!isValid(lname)){
            return res.status(400).send({status:false,message:"Last name is required"})

        }
        if(!isValid(title)){
            return res.status(400).send({status:false,message:"Title is required"})

        }
        if(!isValidTitle(title)){
            return res.status(400).send({status:false,message:"Please provide right title"})

        }

        if(!isValid(email)){
            return res.status(400).send({status:false,message:"Email is required"})

        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
           return res.status(400).send({status:false,message:"Email should be valid"})
        }
        if(!isValid(password)){
            return res.status(400).send({status:false,message:"Password is required"})

        }
        const isEmailPresent=await authorModel.findOne({email:email})
        if(isEmailPresent){
            return res.status(400).send({status:false,message:"email address is already registered"})
        }
        const author=await authorModel.create(body)
        res.status(201).send({status:true,message:"created successfully",data:author})



        
    
    }
    catch (err) {
        
        res.status(500).send({ status:false, data: err.message })
    }

}

const loginAuthor=async function(req,res){
    try{
    let body=req.body 
    if(!isValidRequestBody(body)){
            return res.status(400).send({status:false,message:"Please provide login details"})
    }        
    let {email,password}=req.body
    if(!isValid(email)){
        return res.status(400).send({status:false,message:"Email is required"})

    }
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        return res.status(400).send({status:false,message:"Email should be valid"})
     }
     if(!isValid(password)){
        return res.status(400).send({status:false,message:"Password is required"})

    }


    let data=await authorModel.findOne({email:email,password:password})
    if(!data){
        res.status(400).send({status:false,message:"Invalid login credentials"})
    } 
    else{
        let token=jwt.sign({userId:data._id,batch:"uranium"},"Project1")
        res.status(200).send({status:true,data:{token:token}})

    }
}
catch(err){
    res.status(500).send({status:false,data:err.message})
}

}



module.exports.createAuthor= createAuthor
module.exports.loginAuthor=loginAuthor
