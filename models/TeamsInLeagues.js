const mongoose = require("mongoose");
const Leagues=require('../models/leagues')

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



module.exports= new mongoose.model('TeamsInLeagues',LeagueTeamsSchema);