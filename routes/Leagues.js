const express = require("express");

const router=express.Router();

const {validateCreateLeague,LeagueValidations}=require('../middlewares/validation/leagues')
const {createLeague,orgLeagues}=require('../controllers/leagues');


 router.post("/create-league", validateCreateLeague , LeagueValidations, createLeague);
 router.get("/org-leagues/:org_id",orgLeagues);


module.exports=router