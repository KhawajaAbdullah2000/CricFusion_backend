const Org=require('../models/organization')
const jwt=require('jsonwebtoken');

exports.createOrg=async (req, res) => {
    const isneworg= await Org.verifyUniqueEmail(req.body.email);
    if (!isneworg) return res.json({'success':false,'message':'This email is in use. Try signing in'})
        try {
            const org= new Org(req.body);
            const neworg=await org.save();
            res.status(201).json({'success':true,neworg,_id:neworg._id});
            
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    
    
    }
    
    exports.orgSignIn=async (req,res)=>{
        const {email,password}=req.body;
        const org=await Org.findOne({email});
        if(!org) return res.json({success:false,message:'Organization not found'})
    
        const isMatch=await org.comparePassword(password);
        if(!isMatch) return res.json({success:false,message:'password does not match'})
    
        const token=jwt.sign({orgId:org._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    
        let oldTokens=org.tokens || [];
        if(oldTokens.length){
            oldTokens.filter(t=>{
          const timeDiff=  (Date.now()-parseInt(t.SignedAt))/1000 //Exact time diff in seconds
          if(timeDiff<86400){
            //24 hours in seconds is 86400 secs
            return t; //token isnt expired
          }
            })
        }
         await Org.findByIdAndUpdate(org._id,{
            tokens:[
            ...oldTokens,
            {token,SignedAt:Date.now().toString()}
            ]
         });
    
        res.json({success:true,org,token,_id:org._id});
    }