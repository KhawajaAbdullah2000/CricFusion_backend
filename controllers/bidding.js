const mongoose = require("mongoose");
const User = require("../models/user");
const PlayerInLeagues=require("../models/PlayerInLeagues")

exports.FindPlayer=async(req,res)=>{
try {
   
    const player = await PlayerInLeagues.aggregate([
        {
            $lookup: {
              from: "users",
              localField: "player_id",
              foreignField: "_id",
              as: "PlayerDetails",
            },
          },
          {
            $unwind: "$PlayerDetails",
          },

        {
          $lookup: {
            from: "teams",
            localField: "bidding_team",
            foreignField: "_id",
            as: "BiddingTeam",
          },
        },
        {
            $unwind: {
                path: "$BiddingTeam",
                preserveNullAndEmptyArrays: true  // Preserve if no matching document in 'teams'
            }
        },
        {
           $match: { 
            player_id: new mongoose.Types.ObjectId(req.params.id),
            league_id:new mongoose.Types.ObjectId(req.params.league_id)
        }
         },
   
      ]);

      if(player){
        res.json({success:true,player})
      }else{
        res.json({success:false,message:"Player not found"})
      }
      

} catch (error) {
    res.json({success:false,message:error.message})
}
}

exports.SubmitBid=async(req,res)=>{
  try {
   const filter = { 
    player_id:new mongoose.Types.ObjectId(req.params.id),
    league_id:new mongoose.Types.ObjectId(req.params.league_id)
  };

const update = { 
  current_bid: req.params.bid,
  bidding_team:new mongoose.Types.ObjectId(req.params.team_id)
 };



 let submit_bid=await PlayerInLeagues.findOneAndUpdate(filter, update);

 res.json({success:true,submit_bid})
    
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}