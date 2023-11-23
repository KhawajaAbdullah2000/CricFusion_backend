const League=require('../models/leagues')
const Organization=require('../models/organization')
const mongoose = require("mongoose");
const TeamsInLeagues=require('../models/TeamsInLeagues');

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

  };

  //finding nearby leagues based on city
  exports.nearbyLeagues=async(req,res)=>{

    try {

      const leagues=await League.find({city:req.params.city});
      if (leagues.length){
        res.status(200).json({success:true,leagues:leagues});
      }else{
        res.status(400).json({success:false,message:'No league found'});

      }
      
    } catch (error) {
      res.status(400).json({success:false,message:error.message});

    }
  
  }


  //getting League details
  
exports.LeagueDetails= async (req, res) => {


  const leagueDetails = await League.aggregate([
    {
      $lookup: {
        from: "organizations",
        localField: "org_id",
        foreignField: "_id",
        as: "League",
      },
    },
    {
        $unwind:"$League"
    },
    {
       $match: { _id: new mongoose.Types.ObjectId( req.params.league_id) }// Convert user_id to ObjectId
     },
     {
      $project: {
          "League.tokens":0
         }
    }
  ]);
  
if(leagueDetails.length){
  res.json({success:true,leagueDetails:leagueDetails});
}else{
  res.json({success:false,message:"details not found"})
}
  

};

//Register Team in League
exports.registerTeamInLeague=async(req,res)=>{
  try {

    const existingTeam=await TeamsInLeagues.findOne({league_id:req.body.league_id, team_id:req.body.team_id});
   if(existingTeam){
    res.json({success:false,message:"Team already registered"});
   }else{
     const joinTeam = new TeamsInLeagues(req.body);
     const newTeamJoined = await joinTeam.save();

    res.status(201).json({ success: true, registeration:newTeamJoined });

   }

    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  
//checkif team is registered in league or not
exports.checkTeamRegisteration=async (req,res)=>{
const check=await TeamsInLeagues.findOne({league_id:req.params.league_id,team_id:req.params.team_id});
if(check){
  res.json({success:true,message:"Team Registered",registeration:true});
}else{
  res.json({success:true,message:"Team not Registered",registeration:false});

}
}