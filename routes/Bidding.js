const express = require("express");

const {FindPlayer,SubmitBid,AcceptBid}=require("../controllers/bidding")

const router=express.Router();


router.get("/player/:id/:league_id",FindPlayer)

router.get("/submit-bid/:id/:league_id/:bid/:team_id",SubmitBid)

router.get("/accept-bid/:reg_id/:player_id/:team_id",AcceptBid)

module.exports = router