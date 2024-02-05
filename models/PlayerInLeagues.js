const mongoose = require("mongoose");


const PlayerInLeagueSchema = new mongoose.Schema({
  league_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  player_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  current_bid:{
    type:Number,
    default:1000
  },
  bidding_team:{
    type: mongoose.Schema.ObjectId,
    required:false,
    default:null
  
  },
  status:{
    type:Number,
    default:0 //0-unsold 1-sold
  }



});


module.exports= new mongoose.model('PlayerInLeague',PlayerInLeagueSchema);