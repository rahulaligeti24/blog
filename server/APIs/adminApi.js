const exp = require("express");
const adminApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const Article =require('../models/articleModel')
const {requireAuth}= require('@clerk/express')
 
require("dotenv").config();

adminApp.use(exp.json());

const isPermanentAdmin = async (email) => {
  
  return email === process.env.ADMIN_EMAIL;
 
};

// POST: Verify or create permanent admin
adminApp.post(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    const newAdmin = req.body;
    const isAdminEmail = await isPermanentAdmin(newAdmin.email);

    if (!isAdminEmail) {
      return res.status(403).json({ message: "Invalid role" });
    }

    const userInDb = await UserAuthor.findOne({ email: newAdmin.email });

    if (userInDb) {
      if (userInDb.role === "admin") {
        return res.status(200).json({ message: "admin", payload: userInDb });
      } else {
        userInDb.role = "admin";
        await userInDb.save();
        return res.status(200).json({ message: "admin updated", payload: userInDb });
      }
    } else {
      const adminUser = new UserAuthor({ ...newAdmin, role: "admin", isActive: true });
      const savedAdmin = await adminUser.save();
      return res.status(201).json({ message: "admin created", payload: savedAdmin });
    }
  })
);


// Get users (only if permanent admin)
adminApp.get(
  "/users",requireAuth({signInUrl:"unauthorized"}),
  expressAsyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!(await isPermanentAdmin(email))) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const users = await UserAuthor.find({ role: "user" });
    res.status(200).json({ message: "List of users", payload: users });
  })
);

// Get authors (only if permanent admin)
adminApp.get(
  "/authors",requireAuth({signInUrl:"unauthorized"}),
  expressAsyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!(await isPermanentAdmin(email))) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const authors = await UserAuthor.find({ role: "author" });
    res.status(200).json({ message: "List of authors", payload: authors });
  })
);

// Block/unblock user or author
adminApp.put(
  "/update-status/:email",requireAuth({signInUrl:"unauthorized"}),
  expressAsyncHandler(async (req, res) => {
    const { email } = req.params;
    const { isActive, adminEmail } = req.body;

    if (!(await isPermanentAdmin(adminEmail))) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await UserAuthor.findOneAndUpdate(
      { email },
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User ${isActive ? "unblocked" : "blocked"} successfully`, payload: user });
  })
);


 
module.exports = adminApp;
