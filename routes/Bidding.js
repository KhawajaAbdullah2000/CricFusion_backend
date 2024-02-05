const express = require("express");

const {FindPlayer,SubmitBid}=require("../controllers/bidding")

const router=express.Router();


router.get("/player/:id/:league_id",FindPlayer)

router.get("/submit-bid/:id/:league_id/:bid/:team_id",SubmitBid)

module.exports = router