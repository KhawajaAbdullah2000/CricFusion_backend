const League=require('../models/leagues')
const mongoose = require("mongoose");

exports.createLeague = async (req, res) => {
    const isnewLeague = await League.verifyUniqueLeague(req.body.name);
    if (!isnewLeague)
      return res.json({
        success: false,
        message: "This Leage name is in use. Try another name",
      });
    try {
      const league = new League(req.body);
      const newleague = await league.save();
  
      const startDate=newleague.startsAt.toDateString();
      res.status(201).json({ success: true, league:newleague,startDate });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.orgLeagues=async(req,res)=>{
    const leagues=await League.find({org_id:new mongoose.Types.ObjectId(req.params.org_id)});
    if(leagues.length){
        res.status(200).json({ success: true, leagues });
    }else{
        res.json({success:false,message:"No Leagues found"})
    }
  

    
  }