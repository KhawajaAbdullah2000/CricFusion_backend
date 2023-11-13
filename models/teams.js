const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slogan: {
    type: String,
  },
  captain_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

});



TeamSchema.statics.verifyUniqueTeam=async function(team){
    if(!team) throw new Error("Invalid Team name")
    try {
        const checkteam=await this.findOne({name:team});
        console.log(checkteam);
        if(checkteam){
            return false
        }
        return true

    } catch (error) {
        console.log("Error: ",error.message);
        return false
    }
   
}

module.exports= new mongoose.model('Team',TeamSchema);