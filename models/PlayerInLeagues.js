const mongoose = require("mongoose");


const PlayerInLeagueSchema = new mongoose.Schema({
  league_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  player_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  }


});


module.exports= new mongoose.model('PlayerInLeague',PlayerInLeagueSchema);