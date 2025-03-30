const exp=require('express')
const authorApp=exp.Router()

const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require("./createuserOrAuthor")
const Article=require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require('@clerk/express')
require('dotenv').config()

authorApp.post("/author",expressAsyncHandler(createUserOrAuthor))
//authorApp.use(clerkMiddleware())

authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
    const newArticleObj=req.body;
    const newArticle=new Article(newArticleObj);
    const articleObj=await newArticle.save()

    res.status(201).send({message:"article published",payload:articleObj})

}))


 

//read all artcles
authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listofaritcles= await Article.find({isArticleActive:true})
    res.send({message:"articles",payload:listofaritcles})
}))

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request "})
})


///modify an article by artcile id//

authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified article//
         const modifiedArticle=req.body;
         //update artcilce by artcle id
          const dbRes=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false}) 
     //send res

     res.status(200).send({message:"article modified",payload:dbRes})


}))


//delete(soft dlelete )an article by id
authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{
    //get modified article//
         const modifiedArticle=req.body;
         //update artcilce by artcle id
          const dbRes=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false}) 
     //send res

     res.status(200).send({message:"article deleted or restored",payload:dbRes})

}))




module.exports=authorApp;