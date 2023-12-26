const express = require("express");

const router=express.Router();

const {validateCreateLeague,LeagueValidations}=require('../middlewares/validation/leagues')
const {validateLeagueSchedule,LeagueScheduleValidations}=require('../middlewares/validation/LeagueSchedule');
const {createLeague,orgLeagues,nearbyLeagues,LeagueDetails,registerTeamInLeague,
    checkTeamRegisteration,ScheduleMatch,LeagueSchedule,PlayerAuctionList}=require('../controllers/leagues');


 router.post("/create-league", validateCreateLeague , LeagueValidations, createLeague);
 router.get("/org-leagues/:org_id",orgLeagues);
 router.get("/nearby-leagues/:city",nearbyLeagues);
 router.get("/get-league-details/:league_id",LeagueDetails);
router.post("/register-team",registerTeamInLeague)
router.get("/check-reg-in-league/:league_id/:team_id",checkTeamRegisteration);

router.post('/schedule-match',validateLeagueSchedule,LeagueScheduleValidations,ScheduleMatch)
router.get('/league-schedule/:league_id',LeagueSchedule);
router.get('/player-list-for-auction/:league_id',PlayerAuctionList);
module.exports=router