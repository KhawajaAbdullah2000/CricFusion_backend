const mongoose = require("mongoose");


const LeagueScheduleSchema = new mongoose.Schema({
  league_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  team1_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  team2_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },

  match_date:{
    type:String,
    required:true
  }
 


});


module.exports= new mongoose.model('LeagueSchedule',LeagueScheduleSchema);