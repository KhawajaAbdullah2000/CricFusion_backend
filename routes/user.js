const express = require("express");

const router=express.Router();
const {validateUserSignup,userValidations,validateUserSignIn}=require('../middlewares/validation/user' )

const {createUser,homePage,userSignIn,privatePage,Signout,RegisterAsIndividual,CheckPlayerReg,UserStats,NearBy,
    UpdateLocation,UpdateStatus}=require('../controllers/user');
const { isAuth } = require("../middlewares/auth");


router.get("/", homePage);
router.post("/create-user", validateUserSignup , userValidations, createUser);
router.post('/signin',validateUserSignIn,userValidations,userSignIn);
router.get('/player-logout',isAuth,Signout);
router.post('/register-as-individual',RegisterAsIndividual);
router.get("/check-player-reg-in-league/:league_id/:player_id",CheckPlayerReg);

router.get("/user_stats/:id",UserStats)
router.get("/getNearBy/:id",NearBy)
router.put('/update_location/:id',UpdateLocation)
router.put('/update_status/:id',UpdateStatus)

router.get('/privatePage',isAuth,privatePage)

router.get('/profile',isAuth,(req,res)=>{
    if(!req.user){
        return res.json({sucess:false,message:'Unauthorized Access!'});
    }
    res.json({
        success:true,
        user:{
            _id:req.user._id,
            first_name:req.user.first_name,
            last_name:req.user.last_name,
            email:req.user.email,
            city:req.user.city,
            tokens:req.user.tokens,
            token: req.latestToken
        }
    });
});



module.exports = router