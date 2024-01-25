const Team = require("../models/teams");
const User = require("../models/TeamPlayers");
const jwt = require("jsonwebtoken");
const TeamPlayers = require("../models/TeamPlayers");
const TeamsInLeagues=require('../models/TeamsInLeagues');
const mongoose = require("mongoose");

exports.createTeam = async (req, res) => {
  const isnewTeam = await Team.verifyUniqueTeam(req.body.name);
  if (!isnewTeam)
    return res.json({
      success: false,
      message: "This team name is in use. Try another name",
    });
  try {
    const team = new Team(req.body);
    const newteam = await team.save();

    const addTeamPlayer = new TeamPlayers({
      team_id: newteam._id,
      player_id: req.body.captain_id,
    });
    const playerAdded = await addTeamPlayer.save();
    res.status(201).json({ success: true, newteam });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.myTeams = async (req, res) => {
  // const inTeams= await TeamPlayers.find({player_id:req.params.user_id})

  // const my_teams=Team.find()

  const my_teams = await TeamPlayers.aggregate([
    {
      $lookup: {
        from: "teams",
        localField: "team_id",
        foreignField: "_id",
        as: "myteams",
      },
    },
    {
        $unwind:"$myteams"
    },
    {
       $match: { player_id: new mongoose.Types.ObjectId( req.params.user_id) }// Convert user_id to ObjectId
     },
  ]);

  res.json({ sucess: true, UserId: req.params.user_id, my_teams: my_teams });
};

exports.playersInTeam=async(req,res)=>{
  try {

    const players = await TeamPlayers.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "player_id",
          foreignField: "_id",
          as: "player",
        },
      },
      {
          $unwind:"$player"
      },
      {
         $match: { team_id: new mongoose.Types.ObjectId( req.params.team_id) }// Convert user_id to ObjectId
       },
    ]);



    // const players=await TeamPlayers.find({team_id:req.params.team_id})
     if(players.length>0){
       res.status(200).json({ success: true, players });
     }else{
       res.status(200).json({ success: true, message:'No player Found' });
     }
    
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message:error.message });

  }
}


//Details of a specific team
exports.my_Team = async (req, res) => {
 
  try {

    const team=await Team.findOne({ _id: req.params.team_id });
    if(team){
      res.status(200).json({ success: true, team });
    }else{
      res.status(400).json({ success:false,message:"No team found" });
    }


  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//finding teams registered in leaues
exports.teamsInLeagues=async(req,res)=>{
  const teams_in_leagues = await TeamsInLeagues.aggregate([
    {
      $lookup: {
        from: "teams",
        localField: "team_id",
        foreignField: "_id",
        as: "teams",
      },
    },
    {
        $unwind:"$teams"
    },
    {
       $match: { league_id: new mongoose.Types.ObjectId( req.params.league_id) }// Convert user_id to ObjectId
     },
  ]);
  console.log(teams_in_leagues.length);

  if(teams_in_leagues.length){
     res.json({success:true,teams_in_leagues:teams_in_leagues});
  }else{
    res.json({success:false,message:"No team Found"});

  }


}
