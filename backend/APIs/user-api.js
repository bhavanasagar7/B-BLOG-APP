//create user api app
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../Middlewares/verifyToken')
require("dotenv").config();

let usercollection;
let articlescollection;
//get usercollection app
userApp.use((req, res, next) => {
  usercollection = req.app.get("userscollection");
  articlescollection = req.app.get("articlescollection");
  next();
});

//user registration route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    //get user resource from client
    const newUser = req.body;
    //check for duplicate user based on username
    const dbuser = await usercollection.findOne({ username: newUser.username, userType: newUser.userType });
    //if user found in db
    if (dbuser !== null) {
      res.send({ message: "User existed" });
    } else {
      //hash the password
      const hashedPassword = await bcryptjs.hash(newUser.password, 6);
      //replace plain pw with hashed pw
      newUser.password = hashedPassword;
      //create user
      await usercollection.insertOne(newUser);
      //send res
      res.send({ message: "User created" });
    }
  })
);

//user login
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { username, password, userType } = req.body;
    const user = await usercollection.findOne({ username, userType });
    if (!user) {
      return res.send({ message: "Invalid username or userType" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ message: "Invalid password" });
    }
    const token = jwt.sign({ username, userType }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.send({
      message: "login success",
      token,
      user,
    });
  })
);

//get articles of all authors
userApp.get(
  "/articles",verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get articlescollection from express app
    const articlescollection = req.app.get("articlescollection");
    //get all articles
    let articlesList = await articlescollection
      .find({ status: true })
      .toArray();
    //send res
    res.send({ message: "articles", payload: articlesList });
  })
);

//post comments for an arcicle by atricle id
userApp.post(
  "/comment/:articleId",verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get user comment obj
    const userComment = req.body;
    const articleIdFromUrl=(+req.params.articleId);
    //insert userComment object to comments array of article by id
    let result = await articlescollection.updateOne(
      { articleId: articleIdFromUrl},
      { $addToSet: { comments: userComment } }
    );
    console.log(result);
    res.send({ message: "Comment posted" });
  })
);

//export userApp
module.exports = userApp;
