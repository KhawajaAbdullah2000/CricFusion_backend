const express = require("express");

const router=express.Router();
const {validateUserSignup,userValidations,validateUserSignIn}=require('../middlewares/validation/user' )

const {createUser,homePage,userSignIn,privatePage,Signout}=require('../controllers/user');
const { isAuth } = require("../middlewares/auth");


router.get("/", homePage);
router.post("/create-user", validateUserSignup , userValidations, createUser);
router.post('/signin',validateUserSignIn,userValidations,userSignIn);
router.post('/player-logout',isAuth,Signout);
router.get('/privatePage',isAuth,privatePage)

module.exports = router