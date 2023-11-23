const mongoose = require("mongoose");

const LeagueTeamsSchema = new mongoose.Schema({
 
  league_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  team_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  }


});


// LeagueTeamsSchema.statics.verifyUniqueLeague=async function(name){
//     if(!name) throw new Error("Invalid Team name")
//     try {
//         const checkleague=await this.findOne({name:name});
//         //console.log(checkteam);
//         if(checkleague){
//             return false
//         }
//         return true

//     } catch (error) {
//         console.log("Error: ",error.message);
//         return false
//     }
   
// }

module.exports= new mongoose.model('TeamsInLeagues',LeagueTeamsSchema);