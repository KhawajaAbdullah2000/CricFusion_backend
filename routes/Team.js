const express = require("express");

const router=express.Router();

const {validateCreateTeam,TeamValidations}=require('../middlewares/validation/team')
const {createTeam,myTeams,my_Team,teamsInLeagues,playersInTeam,NearbyPlayers,
    SendRequest,getRequestsSent,getRequestsSentToMe,AcceptRequest,RejectRequest}=require('../controllers/team');

const { isAuth } = require("../middlewares/auth");

 router.post("/create-team",isAuth, validateCreateTeam , TeamValidations, createTeam);
 router.get("/my-teams/:user_id",myTeams);

 router.get("/my_Team/:team_id",my_Team);

router.get("/teams-in-leagues/:league_id",teamsInLeagues)

router.get("/players-in-team/:team_id",playersInTeam)

router.get("/nearby-players/:city",NearbyPlayers)

router.post("/send-request",SendRequest)

router.get("/requests-sent-by-me/:id",getRequestsSent)

router.get("/requests-sent-to-me/:id",getRequestsSentToMe)

router.post("/accept-request",AcceptRequest)
router.get("/reject-request/:id",RejectRequest)

module.exports=router