const mongoose=require("mongoose")
const blogsModel = require("../models/blogsModel")
const authorModel=require("../models/authorModel")
const isValid=function(value){
    if(typeof value==="undefined" || value===null)return false 
    if(typeof value==="string" && value.trim().length===0)return false 
    return true
}
const isValidRequestBody=function(body){
    return Object.keys(body).length>0 
}
const isValidObjectId=function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
}





const createBlogs = async function (req, res) {
    try {
        let reqbody = req.body 
        
        if(!isValidRequestBody(reqbody)){
            return res.status(400).send({status:false,message:"Invalid request parameters please provide blogs details"})
        }
    
    const {title,body,authorId,tags,category,subcategory,isPublished}=req.body 
    if(!isValid(title)){
        return res.status(400).send({status:false,message:"Title is required"})

    }
    if(!isValid(body)){
        return res.status(400).send({status:false,message:"Body  is required"})

    }
    if(!isValid(authorId)){
        return res.status(400).send({status:false,message:"AuthorId is required"})

    }
    if(!isValidObjectId(authorId)){
        return res.status(400).send({status:false,messgae:"Please provide valid authoId"})
    }
    if(!isValid(category)){
        return res.status(400).send({status:false,message:"Category  is required"})

    }
    const author=await authorModel.findById(authorId)
    if(!author){
        return res.status(400).send({status:false,message:"Author id not present"})
    }
    if(isPublished===true){
        reqbody.publishedAt=new Date()
    }
    const blog=await blogsModel.create(reqbody)
    return res.status(201).send({status:false,message:"created successfully",data:blog})
        
}
    catch (err) {
        
        return res.status(500).send({ status:false, error: err.message })
    }
}

const getBlogs=async function(req,res){
    try{
        const query={isDeleted:false,deletedAt:null,isPublished:true}
        const getQuery=req.query 
        if(isValidRequestBody(getQuery)){
            const {authorId,category,tags,subcategory}=getQuery 
            if(isValid(authorId) && isValidObjectId(authorId)){
                query.authorId=authorId
            }
            if(isValid(category)){
                query.category=category.trim()
            }
            if(isValid(tags)){
                const tagsArr=tags.trim().split(',').map(x=>x.trim())
                query.tags={$all:tagsArr}
            }
            if(isValid(subcategory)){
                const subcategoryArr=tags.trim().split(',').map(x=>x.trim())
                query.tags={$all:subcategoryArr}
            }
        }
        const getBlogs=await blogsModel.find(query)
        if(getBlogs.length===0){
            return res.status(404).send({status:false,message:"No blogs found"})
        }
        return res.status(200).send({status:true,data:getBlogs})

            

        
    }
    catch(err){
        res.status(500).send({msg:err.message})
    }

}
const updateBlogs=async function(req,res){
    try{
        const reqbody=req.body 
        let id=req.params.blogId 
        const authorToken=req.authorId
        if(!isValidObjectId(id)){
            return res.status(400).send({status:false,message:"Blog id is not valid"})
        }
        if(!isValidObjectId(authorToken)){
            return res.status(400).send({status:false,message:"Author id is not valid"})
        }
        let blog=await blogsModel.findOne({_id:id,isDeleted:false,deletedAt:null})

        if(!blog){ //if no data found then send error message
            return res.status(404).send({status:false,data:"blog not present"})
        }
        if(blog.authorId.toString()!==authorToken){
            return res.status(401).send({status:false,message:"Unauthorised access"})
        }
        if(!isValidRequestBody(reqbody)){
            return res.status(200).send({status:true,message:"Blog unmodified",data:blog})
        }
        const {title,body,tags,category,subcategory,isPublished}=reqbody
        const updateBlog={}
        
        if(isValid(title)){
            updateBlog.title=req.body.title
        }
        if(isValid(body)){
            updateBlog.body=req.body.body
        }
        if(isValid(category)){
            updateBlog.category=req.body.category
        }
        
        if(isValid(tags)){
            let value=req.body.tags
            
            let update1=updateBlog.tags
            
            update1.push(value)
            
            updateBlog.tags=update1 
            
        }
    
        if(isValid(subcategory)){
            let value=req.body.subcategory
            let update2=updateBlog.subcategory
            update2.push(value)
            updateBlog.subcategory=update2 
        }
        if(isPublished!==undefined){
            updateBlog.isPublished=isPublished
            updateBlog.publishedAt=isPublished?new Date():null;
        }
    
        
        const updateBlogs=await blogsModel.findOneAndUpdate({_id:id},updateBlog,{new:true})
        
        res.status(200).send({status:true,data:updateBlogs})

    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

const deleteId=async function(req,res){
    try{
        let id=req.params.blogId 
        const authorToken=req.authorId
        if(!isValidObjectId(id)){
            return res.status(400).send({status:false,message:"Blog id is not valid"})
        }
        if(!isValidObjectId(authorToken)){
            return res.status(400).send({status:false,message:"Author id is not valid"})
        }
        let blog=await blogsModel.findOne({_id:id,isDeleted:false,deletedAt:null})

        if(!blog){ //if no data found then send error message
            return res.status(404).send({status:false,data:"blog not present"})
        }
        if(blog.authorId.toString()!==authorToken){
            return res.status(401).send({status:false,message:"Unauthorised access"})
        }
        await blogsModel.findOneAndUpdate({_id:id},{$set:{isDeleted:true,deletedAt:new Date()}})
        return res.status(200).send({status:true,message:"Blog deleted succesfully"})
    
    
}
catch(err){
    res.status(500).send({status:false,data:err.message})
}
    
    

    

    
}

const deleteByQuery=async function(req,res){
    try{
    const query={isDeleted:false,deletedAt:null}
    const filterQuery=req.query    
    const authorToken=req.authorId
    if(!isValidObjectId(authorToken)){
        return res.status(400).send({status:false,message:"Author id is not valid"})
    }
    if(!isValidRequestBody(filterQuery)){
        return res.status(400).send({status:false,message:"No query params passed"})
    }
    const{authorId,category,tags,subcategory,isPublished}=filterQuery
    if(isValid(authorId) && isValidObjectId(authorId)){
            query.authorId=authorId
    }
    if(isValid(category)){
        query.category=category.trim()
    }
    if(isValid(isPublished)){
        query.isPublished=isPublished
    }
    if(isValid(tags)){
        const tagsArr=tags.trim().split(",").map(x=>x.trim())
        query.tags={$all:tagsArr}
    }
    if(isValid(subcategory)){
        const subcategoryArr=subcategory.trim().split(",").map(x=>x.trim())
        query.subcategory={$all:subcategoryArr}
    }
    
    const blogs=await blogsModel.find(query)
    if(blogs.length===0){
        return res.status(404).send({status:false,message:"No blogs found"})
    }
    const blogsToBeDeleted=blogs.filter(x=>{if(x.authorId.toString()===authorToken) return x._id})
    
    if(blogsToBeDeleted.length===0){
        return res.status(404).send({status:false,message:"No blogs found"})
    }
    await blogsModel.updateMany({_id:{$in:blogsToBeDeleted}},{$set:{isDeleted:true,deletedAt:new Date()}})
    return res.status(200).send({status:true,message:"Deleted successfully"})
    }


catch(err){
    res.status(500).send({status:false,data:err.message})
}
    

}









module.exports.createBlogs = createBlogs
module.exports.getBlogs=getBlogs
module.exports.updateBlogs=updateBlogs
module.exports.deleteId=deleteId
module.exports.deleteByQuery=deleteByQuery
