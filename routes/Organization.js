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
// router.get('/profile',isAuth,(req,res)=>{
//     if(!req.user){
//         return res.json({sucess:false,message:'Unauthorized Access!'});
//     }
//     res.json({
//         success:true,
//         profile:{
//             user_id:req.user._id,
//             first_name:req.user.first_name,
//             last_name:req.user.last_name,
//             email:req.user.email
//         }
//     });
// });

module.exports = router