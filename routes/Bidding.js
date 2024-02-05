const express = require("express");

const {FindPlayer}=require("../controllers/bidding")

const router=express.Router();


router.get("/player/:id/:league_id",FindPlayer)



module.exports = router