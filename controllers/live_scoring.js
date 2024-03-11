const mongoose = require("mongoose");
const League=require('../models/leagues')
const Organization=require('../models/organization')
const LeagueSchedule=require('../models/LeagueSchedule')
//const TeamsInLeagues=require('../models/TeamsInLeagues');
const Teams=require('../models/teams')
const TeamPlayers=require('../models/TeamPlayers')
//const PlayerInLeague=require('../models/PlayerInLeagues')

 exports.PlayingEleven=async(req,res)=>{

    try {

        const teams=await LeagueSchedule.findOne( {_id:new mongoose.Types.ObjectId(req.params.match_id)},{team1_id:1,team2_id:1});
       const team1_id=teams.team1_id;
       const team2_id=teams.team2_id

       const team1_name=await Teams.findOne(
        {
            _id:new mongoose.Types.ObjectId(team1_id)
        },
        {
            name:1,captain_id:1
        }
        );

        const team2_name=await Teams.findOne(
            {
                _id:new mongoose.Types.ObjectId(team2_id)
            },
            {
                name:1,captain_id:1
            }
            );

        // const players_team1=await TeamPlayers.aggregate(
        //     {
        //         team_id:new mongoose.Types.ObjectId(team1_id),
               
        //     },
        //     {
        //         player_id:1
        //     }
            
        //     );
        
        const players_team1 = await TeamPlayers.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "player_id",
                foreignField: "_id",
                as: "player_name",
              },
            },
            {
                $unwind:"$player_name"
            },
            {
               $match: { team_id: new mongoose.Types.ObjectId( team1_id) }
             },
             {
                $project: {
                  "_id": 0,
                  "player_id": "$player_name._id",
                  "first_name": "$player_name.first_name",
                  "last_name": "$player_name.last_name"
                }
              }
          
          ]);


          const players_team2 = await TeamPlayers.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "player_id",
                foreignField: "_id",
                as: "player_name",
              },
            },
            {
                $unwind:"$player_name"
            },
            {
               $match: { team_id: new mongoose.Types.ObjectId( team2_id) }
             },
             {
                $project: {
                  "_id": 0,
                  "player_id": "$player_name._id",
                  "first_name": "$player_name.first_name",
                  "last_name": "$player_name.last_name"
                }
              }
          
          ]);

        if (players_team1.length>0 && players_team2.length>0){
            res.json({success:true,team1_name,team2_name,players_team1,players_team2})
        }else{
            res.json({success:true,msg:"No playrs found"})
        
        }
     // res.json({success:true,team1_name,team2_name})
        
    } catch (error) {
        console.log(error.message)
    }

    //res.json({success:true,"msg":"Success hehe"+req.params.match_id})
 }

 exports.UpdateMatchDetails=async(req,res)=>{

  try {
    console.log(req.body);
    const filter = { _id: new mongoose.Types.ObjectId( req.body.match_id) };
    const update = { 
      overs: req.body.overs,
      overs_per_bowler:req.body.overs_per_bowler,
      ball_type:req.body.ball_type,
      pitch_type:req.body.pitch_type
    };
    
    const updateMatch=await LeagueSchedule.findOneAndUpdate(filter, update);

    res.json({success:true,message:'Match details updated'});
    
  } catch (error) {
    res.json({success:false,message:error.message});
  }
 


 }

 exports.UpdatePlayingEleven=async(req,res)=>{
  try {
    console.log(req.body);
    const filter = { _id: new mongoose.Types.ObjectId( req.body.match_id) };
    const update = { 
      team1_playing_eleven: req.body.team1_playing_eleven,
      team2_playing_eleven:req.body.team2_playing_eleven
    };
    
    const updateMatch=await LeagueSchedule.findOneAndUpdate(filter, update);

    res.json({success:true,message:'Playing XIs updated'});
    
  } catch (error) {
    res.json({success:false,message:error.message});
  }
 
}

exports.GetPlayingEleven=async(req,res)=>{
try {
  const result=await LeagueSchedule.findOne({_id:new mongoose.Types.ObjectId(req.params.match_id)});
  if(res){
    res.json({success:true,match_details:result});
  }

} catch (error) {
  res.json({success:false,message:error.message});

  console.log(error.message)
}
}

exports.TeamPlayingEleven = async (req, res) => {
  try {

    const team1=await LeagueSchedule.findOne({team1_id:new mongoose.Types.ObjectId(req.params.team_id)})
    if (team1){
       const team1_players = await LeagueSchedule.aggregate([
     {
        $match: { 
          _id: new mongoose.Types.ObjectId(req.params.match_id),
      }
       },
      {
        $project: {
          team1_playing_eleven: {
            $map: {
            input: "$team1_playing_eleven",
              as: "playerId",
              in: { $toObjectId: "$$playerId" } // Convert string IDs to ObjectIDs
            }
          }
         }
       },
       {
        $lookup: {
           from: 'users',
          localField: 'team1_playing_eleven',
          foreignField: '_id',
           as: 'players'
         }
       },
       {
        $unwind: "$players"
      },
      {
         $project: {
           "_id": "$players._id",
          "first_name": "$players.first_name",
           "last_name": "$players.last_name"
        }
       }
     ]);

 if(team1_players && team1_players.length>0){
  res.json({success:true,team_players:team1_players})
 }
 else{
  res.json({ success: false, message: "No players found" });
 }
     
      
    }

    const team2=await LeagueSchedule.findOne({team2_id:new mongoose.Types.ObjectId(req.params.team_id)})
    if (team2){
     const team2_players = await LeagueSchedule.aggregate([
      {
        $match: { 
          _id: new mongoose.Types.ObjectId(req.params.match_id),
        }
      },
      {
         $project: {
           team2_playing_eleven: {
             $map: {
               input: "$team2_playing_eleven",
              as: "playerId",
              in: { $toObjectId: "$$playerId" } // Convert string IDs to ObjectIDs
            }
          }
        }
       },
       {
        $lookup: {
           from: 'users',
           localField: 'team2_playing_eleven',
           foreignField: '_id',
           as: 'players'
         }
       },
       {
      $unwind: "$players"
       },
       {
        $project: {
           "_id": "$players._id",
          "first_name": "$players.first_name",
          "last_name": "$players.last_name"
        }
       }
     ]);

     if ( team2_players && team2_players.length>0) {
      res.json({ success: true,team_players:team2_players });
    } 
   else {
      res.json({ success: false, message: "No players found" });
    }
    }


  

  } catch (error) {
    res.json({ success: false, msg: "In backend try catch" + error.message });
  }
}
