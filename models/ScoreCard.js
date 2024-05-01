const mongoose = require("mongoose");

const ScoreCardSchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'LeagueSchedule' 
  },

  player_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  team_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  balls_faced:{
    type:Number,
    default:0
  },
  runs_scored:{
    type:Number, //saingle double etc
    default:0
  },
  fours_count:{
    type:Number,
    default:0
  },

  sixers_count:{
    type:Number, //saingle double etc
    default:0
  },
  
   fifty_scored:{
      type:Number,
      default:0
    },
    century_scored:{
      type:Number,
      default:0
    }
  ,


  dismissal:{
    type:Number,
    default:0
  },

  overs_bowled:{
    type:Number,
    default:0
  },
  wickets_taken:{
   type:Number,
   default:0
  },
  runs_conceded:{
    type:Number,
    default:0
  }




});


module.exports= new mongoose.model('ScoreCard',ScoreCardSchema);