const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema( {
    title: {type:String,required:"Blog title is required",trim:true}, 
    body: {type:String,required:"Blog body is required",trim:true},
     authorId: {type:mongoose.Schema.Types.ObjectId,ref:"Author",required:"Author id is required"},
    tags: [{type: String,trim:true} ],
    category: {type:String,required:"BLog category is required",trim:true},
     subcategory: [{type:String,trim:true}] ,
     publishedAt:{type:Date,default:null},
     deletedAt:{type:Date,default:null},
      isDeleted: {type:Boolean, default: false}, 
     isPublished: {type:Boolean, default: false}

}, { timestamps: true });

module.exports = mongoose.model('Blogs', blogsSchema) 



