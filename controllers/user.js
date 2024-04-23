const User = require("../models/user");
const PlayerInLeague=require("../models/PlayerInLeagues");
const jwt=require('jsonwebtoken');
const mongoose = require("mongoose");
const ScoreCard=require('../models/ScoreCard')

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


exports.RegisterAsIndividual=async(req,res)=>{
 
        try {
            const register= new PlayerInLeague(req.body);
            const newRegister=await register.save();
            res.status(201).json({success:true,newRegister});
            
        } catch (error) {
            res.status(400).json({ success:false,message: error.message });
        }


}

exports.CheckPlayerReg= async(req,res)=>{

    const check=await PlayerInLeague.findOne(
        {league_id:new mongoose.Types.ObjectId(req.params.league_id),
         player_id:new mongoose.Types.ObjectId(req.params.player_id)
        
        }
        );

        if (check){
            res.status(200).json({success:true,registeration:check});

        }else{
            res.json({success:false,message:"No registeration found"})
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



exports.UserStats=async(req,res)=>{
    try {
        const userId = req.params.id;
        
        // Fetch user information
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const matches= await ScoreCard.find({player_id:req.params.id}); 
        matches_played=matches.length;


        // Aggregate performance data

        // const performance = await ScoreCard.aggregate([
        //     { $match: { player_id: new mongoose.Types.ObjectId(userId) } },
        //     { $group: {
        //         _id: "$player_id",
        //         total_balls_bowled: { $sum: "$overs_bowled" },
        //         total_runs_scored: { $sum: "$runs_scored" },
        //         total_fours_count: { $sum: "$fours_count" },
        //         total_sixers_count: { $sum: "$sixers_count" },
        //         total_fifty_scored: { $sum: "$fifty_scored" },
        //         total_century_scored: { $sum: "$century_scored" },
        //         total_wickets_taken: { $sum: "$wickets_taken" },
        //         total_runs_conceded: { $sum: "$runs_conceded" }
        //     }},
        //     { $project: {
        //         total_overs_bowled: { 
        //             $concat: [
        //                 { $toString: { $floor: { $divide: ["$total_balls_bowled", 6] } } },
        //                 ".",
        //                 { $toString: { $mod: ["$total_balls_bowled", 6] } }
        //             ]
        //         },
        //         total_balls_bowled: 1,  // Including the sum of balls bowled
        //         total_runs_scored: 1,   // Include all summed metrics for display
        //         total_fours_count: 1,
        //         total_sixers_count: 1,
        //         total_fifty_scored: 1,
        //         total_century_scored: 1,
        //         total_wickets_taken: 1,
        //         total_runs_conceded: 1,
        //         batting_rating: {
        //             $divide: [
        //                 { $add: [
        //                     "$total_runs_scored",
        //                     { $multiply: ["$total_fours_count", 4] },
        //                     { $multiply: ["$total_sixers_count", 6] },
        //                     { $multiply: ["$total_fifty_scored", 10] },
        //                     { $multiply: ["$total_century_scored", 20] }
        //                 ]},
        //                 200 // Adjust as needed
        //             ]
        //         },
        //         bowling_rating: {
        //             $divide: [
        //                 { $subtract: [
        //                     { $add: [
        //                         { $multiply: ["$total_wickets_taken", 10] },
        //                         "$total_overs_bowled"
        //                     ]},
        //                     { $divide: ["$total_runs_conceded", 2] }
        //                 ]},
        //                 10 // Adjust as needed
        //             ]
        //         }
        //     }}
        //   ]);
        const performance = await ScoreCard.aggregate([
            { $match: { player_id: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: "$player_id",
                total_balls_bowled: { $sum: "$overs_bowled" },
                total_runs_scored: { $sum: "$runs_scored" },
                total_fours_count: { $sum: "$fours_count" },
                total_sixers_count: { $sum: "$sixers_count" },
                total_fifty_scored: { $sum: "$fifty_scored" },
                total_century_scored: { $sum: "$century_scored" },
                total_wickets_taken: { $sum: "$wickets_taken" },
                total_runs_conceded: { $sum: "$runs_conceded" },
                total_balls_faced:{$sum:"$balls_faced"},
                dismissals: { $sum: "$dismissal" }  // Assuming `dismissal` counts how many times the batsman has been dismissed
            }},
            { $project: {
                total_overs_bowled: {
                    $concat: [
                        { $toString: { $floor: { $divide: ["$total_balls_bowled", 6] } } },
                        ".",
                        { $toString: { $mod: ["$total_balls_bowled", 6] } }
                    ]
                },
                batting_average: {
                    $cond: {
                        if: { $eq: ["$dismissals", 0] },
                        then: "$total_runs_scored",
                        else: { $divide: ["$total_runs_scored", "$dismissals"] }
                    }
                },
                batting_strike_rate: {
                    $cond: {
                        if: { $eq: ["$total_balls_faced", 0] },
                        then: "$total_runs_scored",
                        else: { $multiply: [{ $divide: ["$total_runs_scored", "$total_balls_faced"] }, 100] }
                    }
                },
                bowling_average: {
                    $cond: {
                        if: { $eq: ["$total_wickets_taken", 0] },
                        then: "$total_runs_conceded",
                        else: { $divide: ["$total_runs_conceded", "$total_wickets_taken"] }
                    }
                },
                bowling_economy_rate: {
                    $cond: {
                        if: { $eq: ["$total_balls_bowled", 0] },
                        then: null,
                        else: {
                            $divide: [
                                "$total_runs_conceded",
                                {
                                    $add: [
                                        { $floor: { $divide: ["$total_balls_bowled", 6] } },
                                        { $divide: [{ $mod: ["$total_balls_bowled", 6] }, 6] }
                                    ]
                                }
                            ]
                        }
                    }
                },
                total_runs_scored: 1,
                total_wickets_taken: 1,
                total_runs_conceded: 1,
                dismissals:1,
                batting_rating: {
                    $let: {
                        vars: {
                            average_score: { $multiply: [40, { $divide: ["$batting_average", 10] }] },
                            strike_rate_score: { $multiply: [30, { $divide: ["$batting_strike_rate", 20] }] },
                            milestone_score: { $add: [
                                { $multiply: [10, { $divide: ["$total_centuries", 1] }] },
                                { $multiply: [10, { $divide: ["$total_fifties", 1] }] }
                            ] },
                            matches_score: { $multiply: [10, { $divide: [matches_played, 5] }] }
                        },
                        in: { $sum: ["$$average_score", "$$strike_rate_score", "$$milestone_score", "$$matches_score"] }
                    }
                },
                bowling_rating: {
                    $let: {
                        vars: {
                            average_score: { $multiply: [40, { $divide: [100, "$bowling_average"] }] }, // Lower average is better
                            economy_score: { $multiply: [30, { $divide: [15, "$bowling_economy_rate"] }] }, // Lower economy is better
                            matches_score: { $multiply: [10, { $divide: ["$total_matches_played", 8] }] },
                            wickets_score: { $multiply: [20, { $divide: ["$total_wickets_taken", 5] }] }
                        },
                        in: { $sum: ["$$average_score", "$$economy_score", "$$matches_score", "$$wickets_score"] }
                    }
                }
            }}
            
            
          ]);
          

       
          
        //   //Normalize ratings to a scale of 0 to 100
        //   performance.forEach(p => {
        //     p.batting_rating = Math.min(Math.max(p.batting_rating * 100, 0), 100);
        //     p.bowling_rating = Math.min(Math.max(p.bowling_rating * 100, 0), 100);
        //   });
          
          
      
    
        // Prepare response data
        const responseData = {
          first_name: user.first_name,
          last_name: user.last_name,
          performance: performance.length > 0 ? performance[0] : {}
        };
    
        res.json(responseData);
      } catch (error) {
        console.error("Server Error", error.message);
        res.status(500).send('Server error');
      }
}