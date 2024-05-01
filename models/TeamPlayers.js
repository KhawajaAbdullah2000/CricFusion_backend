const mongoose = require("mongoose");

const TeamPlayersSchema = new mongoose.Schema({
  team_id: {
    type: mongoose.Schema.ObjectId
  },
  player_id: {
    type:  mongoose.Schema.ObjectId,
    ref: 'User' 
  }

});


module.exports= new mongoose.model('TeamPlayers',TeamPlayersSchema);