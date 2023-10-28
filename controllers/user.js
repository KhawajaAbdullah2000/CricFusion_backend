const User = require("../models/user");
const jwt=require('jsonwebtoken');

exports.homePage=(req,res)=>{
    res.json({'success':true,'message':"welcome to home page"})
}

exports.createUser=async (req, res) => {
    const isnewuser= await User.verifyUniqueEmail(req.body.email);
    if (!isnewuser) return res.json({'success':false,'message':'This email is in use. Try signing in'})
        try {
            const user= new User(req.body);
            const newuser=await user.save();
            res.status(201).json({'success':true,newuser});
            
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    
    
    }

exports.userSignIn=async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user) return res.json({success:false,message:'User not found'})

    const isMatch=await user.comparePassword(password);
    if(!isMatch) return res.json({success:false,message:'password does not match'})

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

    let oldTokens=user.tokens || [];
    if(oldTokens.length){
        oldTokens.filter(t=>{
      const timeDiff=  (Date.now()-parseInt(t.SignedAt))/1000 //Exact time diff in seconds
      if(timeDiff<86400){
        //24 hours in seconds is 86400 secs
        return t; //token isnt expired
      }
        })
    }
     await User.findByIdAndUpdate(user._id,{
        tokens:[
        ...oldTokens,
        {token,SignedAt:Date.now().toString()}
        ]
     });

    res.json({success:true,user,token});
}

exports.Signout=async (req,res)=>{
    if(req.headers && req.headers.authorization){
 
        const token=req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({
                success:false,
                'message':'Authorization failed'
            })
        }
        const tokens=req.user.tokens;
        if(!tokens.length){
           return res.json({success:false,message:"You are not logged in"})
        }
        const newTokens=tokens.filter(t=>t.token!==token);
        await User.findByIdAndUpdate(req.user._id,{
            tokens:newTokens
        });
        return res.json({
            success:true,
            'message':'Signed out successfully'
        });
        
    }

}

//private page if user is signed in then can only acces
exports.privatePage=(req,res)=>{
   res.json({message:"Welcome. you mare logged in "+req.user.first_name+" "+req.user.last_name})
}

