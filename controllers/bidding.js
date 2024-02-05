const mongoose = require("mongoose");
const User = require("../models/user");
const PlayerInLeagues=require("../models/PlayerInLeagues")

exports.FindPlayer=async(req,res)=>{
try {
    // const player=await User.findOne({_id:new mongoose.Types.ObjectId(req.params.id)},{password:0,tokens:0})
    // if (player){
    //     res.json({success:true,player})
    // }else{
    //     res.json({success:false,message:"No player found"})
    // }
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