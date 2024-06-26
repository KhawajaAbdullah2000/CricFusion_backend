const mongoose = require("mongoose");
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
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
  status:{
    type:Boolean,
    default:false
  },
  Phone:{
    type:Number,
    default:3332227364
  },
  latitude:{
    type:Number
  },
  longitude:{
    type:Number
  },

  avatar:Buffer,
  tokens:[{type:Object}]
});

userSchema.pre('save',function(next){

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


userSchema.methods.comparePassword=async function(password){
  if(!password) throw new Error('Password is missing.cannot compare')
  try {
    const result=await bcrypt.compare(password,this.password);
    return result;
    
  } catch (error) {
    console.log(error.message);
  }
}

userSchema.statics.verifyUniqueEmail=async function(email){
    if(!email) throw new Error("Invalid Email")
    try {
        const user=await this.findOne({email});
        if(user){
            return false
        }
        return true

    } catch (error) {
        console.log("Error: ",error.message);
        return false
    }
   
}

module.exports= new mongoose.model('User',userSchema);