const express = require("express");

const router=express.Router();

const {validateCreateTeam,TeamValidations}=require('../middlewares/validation/team')
const {createTeam,myTeams,my_Team,teamsInLeagues,playersInTeam}=require('../controllers/team');

const { isAuth } = require("../middlewares/auth");

 router.post("/create-team",isAuth, validateCreateTeam , TeamValidations, createTeam);
 router.get("/my-teams/:user_id",myTeams);

 router.get("/my_Team/:team_id",my_Team);

router.get("/teams-in-leagues/:league_id",teamsInLeagues)

router.get("/players-in-team/:team_id",playersInTeam)

module.exports=router