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