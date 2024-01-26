const mongoose = require("mongoose");


const PlayerRequests = new mongoose.Schema({
  requestor_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  request_to_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  team_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  status:{
    type:String,
    default:'pending'
  }


});


module.exports= new mongoose.model('PlayerRequests',PlayerRequests);