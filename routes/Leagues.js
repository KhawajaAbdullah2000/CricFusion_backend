const express = require("express");

const router=express.Router();

const {validateCreateLeague,LeagueValidations}=require('../middlewares/validation/leagues')
const {validateLeagueSchedule,LeagueScheduleValidations}=require('../middlewares/validation/LeagueSchedule');
const {createLeague,orgLeagues,nearbyLeagues,LeagueDetails,registerTeamInLeague,
    checkTeamRegisteration,ScheduleMatch,LeagueSchedule,PlayerAuctionList}=require('../controllers/leagues');

 const {PlayingEleven,UpdateMatchDetails,UpdatePlayingEleven,GetPlayingEleven,
    TeamPlayingEleven,InsertBallData,InsertBallerData}=require("../controllers/live_scoring")


 router.post("/create-league", validateCreateLeague , LeagueValidations, createLeague);
 router.get("/org-leagues/:org_id",orgLeagues);
 router.get("/nearby-leagues/:city",nearbyLeagues);
 router.get("/get-league-details/:league_id",LeagueDetails);
router.post("/register-team",registerTeamInLeague)
router.get("/check-reg-in-league/:league_id/:team_id",checkTeamRegisteration);

router.post('/schedule-match',validateLeagueSchedule,LeagueScheduleValidations,ScheduleMatch)
router.get('/league-schedule/:league_id',LeagueSchedule);
router.get('/player-list-for-auction/:league_id',PlayerAuctionList);

//live scoring
router.get("/playing_eleven/:match_id",PlayingEleven)
router.put("/update_playing_eleven",UpdatePlayingEleven)
router.put("/update_match_details",UpdateMatchDetails)
router.get("/get_playing_elevens/:match_id",GetPlayingEleven);
router.get("/players_batting_team/:match_id/:team_id",TeamPlayingEleven)
router.post("/insert_ball_data",InsertBallData); //for batsman
router.post("/insert_baller_data",InsertBallerData); //for bowler
module.exports=router