const mongoose = require("mongoose");


const ScoreCardSchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  player_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
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
  runs_given:{
    type:Number,
    default:0
  }



  



 


});


module.exports= new mongoose.model('ScoreCard',ScoreCardSchema);