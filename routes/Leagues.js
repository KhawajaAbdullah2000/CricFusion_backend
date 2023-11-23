const express = require("express");

const router=express.Router();

const {validateCreateLeague,LeagueValidations}=require('../middlewares/validation/leagues')
const {createLeague,orgLeagues,nearbyLeagues,LeagueDetails,registerTeamInLeague,checkTeamRegisteration}=require('../controllers/leagues');


 router.post("/create-league", validateCreateLeague , LeagueValidations, createLeague);
 router.get("/org-leagues/:org_id",orgLeagues);
 router.get("/nearby-leagues/:city",nearbyLeagues);
 router.get("/get-league-details/:league_id",LeagueDetails);
router.post("/register-team",registerTeamInLeague)

router.get("/check-reg-in-league/:league_id/:team_id",checkTeamRegisteration);

module.exports=router