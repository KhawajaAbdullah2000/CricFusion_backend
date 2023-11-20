const mongoose = require("mongoose");
const bcrypt=require('bcrypt')

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  city:{
    type:String,
    required:true
  },

  tokens:[{type:Object}]
});

orgSchema.pre('save',function(next){

  if (!this.isModified('password')) {
    return next();
  }

   if(this.isModified('password')){
    bcrypt.hash(this.password,8,(err,hash)=>{
      if (err) return next(err);

      this.password=hash;
      next();
    })
   }
})


orgSchema.methods.comparePassword=async function(password){
  if(!password) throw new Error('Password is missing.cannot compare')
  try {
    const result=await bcrypt.compare(password,this.password);
    return result;
    
  } catch (error) {
    console.log(error.message);
  }
}

orgSchema.statics.verifyUniqueEmail=async function(email){
    if(!email) throw new Error("Invalid Email")
    try {
        const org=await this.findOne({email});
        if(org){
            return false
        }
        return true

    } catch (error) {
        console.log("Error: ",error.message);
        return false
    }
   
}

module.exports= new mongoose.model('Organization',orgSchema);