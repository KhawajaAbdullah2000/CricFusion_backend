const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  org_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  startsAt:{
    type:Date,
    required:true
  },
  num_of_teams:{
    type:Number,
    required:true
  }

});



LeagueSchema.statics.verifyUniqueLeague=async function(name){
    if(!name) throw new Error("Invalid Team name")
    try {
        const checkleague=await this.findOne({name:name});
        //console.log(checkteam);
        if(checkleague){
            return false
        }
        return true

    } catch (error) {
        console.log("Error: ",error.message);
        return false
    }
   
}

module.exports= new mongoose.model('League',LeagueSchema);