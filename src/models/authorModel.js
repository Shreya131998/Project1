const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema( {
    fname: {type:String, required:"First name is required",trim:true},
     lname: {type:String, required:"Last name is required",trim:true},
    title: {type:String, required:"Title is required", enum:["Mr", "Mrs", "Miss"]},
    email: {type:String, required:"Email is required",trim:true,lowercase:true, validate:{
        validator:function(v){
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message:"Please enter a valid email"
    } 
    , unique:true}, 
     password: {type:String, required:"Password is required",trim:true} 
     

}, { timestamps: true });


module.exports = mongoose.model('Author', authorSchema) 
