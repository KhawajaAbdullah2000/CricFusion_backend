const express = require("express");

const router=express.Router();
const {validateOrgSignup,orgValidations,validateOrgSignIn}=require('../middlewares/validation/organization' )
const {createOrg,orgSignIn}=require('../controllers/org');

//const {createUser,homePage,userSignIn,privatePage,Signout}=require('../controllers/user');
const { isOrgAuth } = require("../middlewares/org_auth");


router.post("/create-org", validateOrgSignup , orgValidations, createOrg);
router.post('/org-signin',validateOrgSignIn,orgValidations,orgSignIn);
//router.get('/player-logout',isAuth,Signout);
//router.get('/privatePage',isAuth,privatePage)
router.get('/org-profile',isOrgAuth,(req,res)=>{
    if(!req.org){
         return res.json({sucess:false,message:'Unauthorized Access!'});     }
    res.json({
         success:true,
         org:{
            _id:req.org._id,
            name:req.org.name,
           email:req.org.email,
           city:req.org.city,
           tokens:req.org.tokens,
           token:req.latestToken
        }
     });
 });

module.exports = router