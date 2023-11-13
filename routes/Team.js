const express = require("express");

const router=express.Router();

const {validateCreateTeam,TeamValidations}=require('../middlewares/validation/team')
const {createTeam,myTeams}=require('../controllers/team');

const { isAuth } = require("../middlewares/auth");

 router.post("/create-team",isAuth, validateCreateTeam , TeamValidations, createTeam);
 router.get("/my-teams/:user_id",myTeams);



module.exports=router