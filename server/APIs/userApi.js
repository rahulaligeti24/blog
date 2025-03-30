const express = require('express');
const userApp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const UserAuthor = require("../models/userAuthorModel");
const {requireAuth,clerkMiddleware}=require("@clerk/express")
const Article = require("../models/articleModel");
const createUserOrAuthor = require('./createuserOrAuthor');

// Create new user/author
userApp.post("/user", expressAsyncHandler(createUserOrAuthor));

// Add comment to article
userApp.put('/comment/:articleId', expressAsyncHandler(async (req, res) => {
  const commentObj = req.body;

  const articleWithComments = await Article.findOneAndUpdate(
    { articleId: req.params.articleId },
    { $push: { comments: commentObj } },
    { returnOriginal: false }
  );

  res.status(200).send({ message: "comment added", payload: articleWithComments });
}));



userApp.get('/articles',requireAuth({signInUrl:"unauthorized"}) ,expressAsyncHandler(async(req,res)=>{
    const ArticleList=await Article.find({isArticleActive:true});
    res.status(200).send({ message: "articles", payload: ArticleList })
}))

userApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})


module.exports = userApp;
