const Team = require("../models/teams");
const User = require("../models/TeamPlayers");
const Players=require("../models/user")
const jwt = require("jsonwebtoken");
const TeamPlayers = require("../models/TeamPlayers");
const TeamsInLeagues=require('../models/TeamsInLeagues');
const PlayerRequests=require("../models/PlayerRequests")
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

//find nearby players by city to send request
exports.NearbyPlayers=async (req,res)=>{
  const city=req.params.city;
  try {
    const players=await Players.find({city},{tokens:0});
    if (players.length>0){
      res.json({success:true,players,city});
    }else{
      res.json({success:false,message:'No player found'});

    }

  } catch (error) {

     res.json({success:false,message:error.message});

  }

}

exports.SendRequest=async(req,res)=>{
  //PlayerRequests
  try {
    const player_request = new PlayerRequests(req.body);
    const playerRequest = await player_request.save();

    res.status(201).json({ success: true, playerRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getRequestsSent=async(req,res)=>{
try {
  const playerRequests = await PlayerRequests.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "request_to_id",
        foreignField: "_id",
        as: "RequestTo",
      },
    },
    {
      $unwind: "$RequestTo",
    },
    {
      $lookup: {
        from: "teams",
        localField: "team_id",
        foreignField: "_id",
        as: "Team",
      },
    },
    {
      $unwind: "$Team",
    },
    {
      $match: { requestor_id: new mongoose.Types.ObjectId(req.params.id) }
    }
  ]);

  if (playerRequests.length>0){
    res.json({success:true,playerRequests})
  }else{
    res.json({success:false,message:'No request sent by you'})

  }


} catch (error) {

      res.json({success:false,message:error.message})

}
}

exports.getRequestsSentToMe=async(req,res)=>{
  try {
    const Requests = await PlayerRequests.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "requestor_id",
          foreignField: "_id",
          as: "Requestor",
        },
      },
      {
        $unwind: "$Requestor",
      },
      {
        $lookup: {
          from: "teams",
          localField: "team_id",
          foreignField: "_id",
          as: "Team",
        },
      },
      {
        $unwind: "$Team",
      },
      {
        $match: { 
          request_to_id: new mongoose.Types.ObjectId(req.params.id),
          status: "pending" // Add the condition for status
        }
      },
  
      {
        $project: {
          "Requestor.tokens": 0 //hide token columns
        }
      }
    ]);
  
    if (Requests.length>0){
      res.json({success:true,Requests})
    }else{
      res.json({success:false,message:'No request sent to you'})
  
    }
  
  
  } catch (error) {
  
        res.json({success:false,message:error.message})
  
  }

}

exports.AcceptRequest=async(req,res)=>{
  try {
    const add_player = new TeamPlayers({
      team_id:req.body.team_id,
      player_id:req.body.player_id
    });
    const newplayer = await add_player.save();

    console.log(newplayer);

const filter = { _id: req.body._id};
const update = { status: "Accepted" };

// `doc` is the document _after_ `update` was applied because of
// `new: true`
const player_request = await PlayerRequests.findOneAndUpdate(filter, update, {
  new: true
});
console.log("Player Request status updated: ",player_request);

    res.json({success:true,newplayer})
  } catch (error) {
    res.json({success:false,message:error.message})

  }

}

exports.RejectRequest=async(req,res)=>{
try {
  const delete_req=await PlayerRequests.deleteOne({_id:new mongoose.Types.ObjectId(req.params.id)})
  res.json({success:true,message:"Request deleted"});
  
} catch (error) {
  res.json({success:true,message:error.message})
}

}