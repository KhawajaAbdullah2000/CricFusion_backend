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
  },
  match_status:{
    type:Number,
    default:0
  },
  team1_playing_eleven: {
  type:Array,
  default:[]
    },
  team2_playing_eleven: {
    type:Array,
    default:[]
        },
    


  overs:{
    type:Number,
    default:0
  },
  overs_per_bowler:{
    type:Number,
    default:0
  },
  ball_type:{
    type:String,
    default:"hard"
  },
  pitch_type:{
    type:String,
    default:'rough'
  }

 


});


module.exports= new mongoose.model('LeagueSchedule',LeagueScheduleSchema);