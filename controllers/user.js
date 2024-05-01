const User = require("../models/user");
const PlayerInLeague=require("../models/PlayerInLeagues");
const jwt=require('jsonwebtoken');
const mongoose = require("mongoose");
const ScoreCard=require('../models/ScoreCard');
const TeamPlayers = require("../models/TeamPlayers");
const axios = require('axios');


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
                total_fours_count:1,
                total_sixers_count:1,
                total_wickets_taken: 1,
                total_runs_conceded: 1,
                dismissals:1,
                total_balls_faced:1,
                batting_rating: {
                    $let: {
                        vars: {
                            average_score: { $multiply: [40, { $divide: ["$batting_average", 10] }] },
                            strike_rate_score: { $multiply: [30, { $divide: ["$batting_strike_rate", 10] }] },
                            milestone_score: { $add: [
                                { $multiply: [10, { $divide: ["$total_fours_count", 10] }] },
                                { $multiply: [10, { $divide: ["$total_sixers_count", 5] }] }
                            ] },
                            matches_score: { $multiply: [10, { $divide: [matches_played, 2] }] }
                        },
                        in: { $sum: ["$$average_score", "$$strike_rate_score", "$$milestone_score", "$$matches_score"] }
                    }
                },
                bowling_rating: {
                    $let: {
                        vars: {
                            average_score: { $multiply: [40, { $divide: [100, "$bowling_average"] }] }, // Lower average is better
                            economy_score: { $multiply: [30, { $divide: [15, "$bowling_economy_rate"] }] }, // Lower economy is better
                            matches_score: { $multiply: [10, { $divide: ["$total_matches_played", 2] }] },
                            wickets_score: { $multiply: [20, { $divide: ["$total_wickets_taken", 3] }] }
                        },
                        in: { $sum: ["$$average_score", "$$economy_score", "$$matches_score", "$$wickets_score"] }
                    }
                }
            }}
            
            
          ]);
          
          performance.forEach(p => {
                p.batting_rating =Math.floor( Math.min( p.batting_rating, 100));
                p.bowling_rating =Math.floor( Math.min(p.bowling_rating,100));


               });

       

    
        // Prepare response data
        const responseData = {
            success:true,
          first_name: user.first_name,
          last_name: user.last_name,
          status:user.status,
          phone:user.Phone,
          matches_played:matches_played,
          performance: performance.length > 0 ? performance[0] : "No record"
        };

    
        res.json(responseData);
      } catch (error) {
        console.error("Server Error", error.message);
        res.status(500).send('Server error');
      }
}

exports.UpdateLocation=async(req,res)=>{
try {

    const user=await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) }, // Query criteria
        { $set: 
            { 
            latitude: req.body.latitude,
            longitude:req.body.longitude
            } 
    }
    );
    res.json({success:true,message:"Location updated"})
    
} catch (error) {
    res.json({success:false,error:error.message});
}
}

exports.UpdateStatus=async(req,res)=>{
    try {
        console.log(req.body)
        const user=await User.findOneAndUpdate(
          
            { _id: new mongoose.Types.ObjectId(req.params.id) }, // Query criteria
            { $set: 
                { 
                status: req.body.status
                
                } 
        }
        );
        res.json({success:true,message:"Status updated"})
        
    } catch (error) {
        res.json({success:false,error:error.message});
    }
    }



async function calculateTravelTime(requesting, player  ) {
    const apiKey = process.env.API_key;
    const origin = `${requesting.latitude},${requesting.longitude}`;
    const destination = `${player.latitude},${player.longitude}`;
   // console.log(origin,destination);
   const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl);

      const travelTime = response.data.rows[0].elements[0].duration.text;
      return travelTime;
    } catch (error) {
      console.error('Error calculating travel time:', error);
      return null;
    }
  }

  function getMinutesFromTravelTime(travelTime) {
    const parts = travelTime.split(' ');
    let minutes = 0;
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'hours') {
            minutes += parseInt(parts[i - 1]) * 60;
        } else if (parts[i] === 'mins' || parts[i] === 'min') {
            minutes += parseInt(parts[i - 1]);
        }
    }
    return minutes;
}

exports.NearBy=async (req,res)=>{
    try {
        console.log("Incomming request for nearby")
    const requestingPlayer = await User.findOne({ _id: new mongoose.Types.ObjectId(req.params.id)},{tokens:0});
    if (!requestingPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Fetch available players in the same city, excluding the requesting player
    const availablePlayers = await User.find({
      city: requestingPlayer.city,
      status: 1, // Assuming status 1 represents available players
      _id: { $ne: requestingPlayer._id } ,
     // Exclude requesting player
    }, {tokens:0});

    if(availablePlayers.length>0){
        const playersWithTravelTimes =await Promise.all(availablePlayers.map(async (player) => {
        
            const travelTime = await calculateTravelTime(requestingPlayer, player);
            return { ...player.toObject(), travelTime };
          }));
           // Sort players by travel time in ascending order
           playersWithTravelTimes.sort((a, b) => {
              const timeA = getMinutesFromTravelTime(a.travelTime);
              const timeB = getMinutesFromTravelTime(b.travelTime);
              return timeA - timeB;
          });
      
          // Filter players with travel time less than or equal to 20 minutes and recommend up to 5 players
          const recommendedPlayers = playersWithTravelTimes.filter(player => {
              const travelTimeInMinutes = getMinutesFromTravelTime(player.travelTime);
              return travelTimeInMinutes <= 20;
          }).slice(0, 5);
      
          res.json({ success:true,recommendedPlayers });
          //res.json({ availablePlayers: playersWithTravelTimes });
          
    }else{
        res.json({success:false,message:"No nearby players"});
    }

    // Calculate travel time to each available player
   

  } catch (error) {
    console.error('Error searching for available players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.Recommend=async(req,res)=>{
    const  teamId  =new mongoose.Types.ObjectId (req.params.team_id);

    if (!teamId) {
      return res.status(400).json({ error: 'Team ID is required' });
    }
  
    try {
      const recommendedPlayers = await recommendPlayers(teamId);
      res.json({ success:true,recommendedPlayers });
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      res.status(500).json({success:false, error: 'Failed to get recommendations' });
    }
}

async function recommendPlayers(teamId) {
    const teamPlayers = await TeamPlayers.find({ team_id: teamId }).populate({
        path: 'player_id',
        select: '-password -tokens'  // Ensure sensitive fields are excluded
    });
  
    const playerPerformances = [];
  
    for (const player of teamPlayers) {
        const performanceMetrics = await getPlayerPerformanceMetrics(player.player_id);
        playerPerformances.push({
            player_id: player.player_id._id,  // Only include the ID, or include more data if needed
            player_details: player.player_id, // Include player details
            performance: performanceMetrics,
            ewma_score: performanceMetrics.runs_scored_avg // Ensure this includes the EWMA score
        });
    }
  
    // Sort by EWMA score in descending order
    playerPerformances.sort((a, b) => b.ewma_score - a.ewma_score);
  
    return playerPerformances;  // Return full player performances including EWMA scores
}


  async function getPlayerPerformanceMetrics(playerId) {
    // Fetch data without sorting by populated field
    const performances = await ScoreCard.find({ player_id: playerId })
      .populate({
        path: 'match_id',
        select: 'match_date' // Ensure this populates correctly
      });
  
    // Convert dates and sort manually
    const sortedPerformances = performances.map(performance => ({
      score: performance.runs_scored,
      date: new Date(performance.match_id.match_date) // Make sure dates are correctly formatted
    })).sort((a, b) => b.date - a.date); // Sort descending by date
  
    //console.log(sortedPerformances)
    return {
      runs_scored_avg: calculateDecayMovingAverage(sortedPerformances, 0.5),
    };
  }

  function calculateDecayMovingAverage(data, alpha) {
    let weightedSum = 0;
    let weight = 1;
    let totalWeights = 0;
    let currentDate = new Date();
   
  
    for (const item of data) {

      const daysSinceMatch = (currentDate - new Date(item.date)) / (1000 * 3600 * 24);
      const decayWeight = Math.exp(-alpha * daysSinceMatch);
      weightedSum += item.score * decayWeight;
      totalWeights += decayWeight;
    }

    console.log(weightedSum / totalWeights);
  
    return weightedSum / totalWeights;
  }


  exports.RecommendBowler=async(req,res)=>{
    const  teamId  =new mongoose.Types.ObjectId (req.params.team_id);

    if (!teamId) {
      return res.status(400).json({ error: 'Team ID is required' });
    }
  
    try {
      const recommendedPlayers = await recommendPlayersBowlers(teamId);
      res.json({ success:true,recommendedPlayers });
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      res.status(500).json({success:false, error: 'Failed to get recommendations' });
    }
}

async function recommendPlayersBowlers(teamId) {
    const teamPlayers = await TeamPlayers.find({ team_id: teamId }).populate({
        path: 'player_id',
        select: '-password -tokens'  // Ensure sensitive fields are excluded
    });
  
    const playerPerformances = [];
  
    for (const player of teamPlayers) {
        const performanceMetrics = await getPlayerPerformanceMetricsBowlers(player.player_id);
        playerPerformances.push({
            player_id: player.player_id._id,  // Only include the ID, or include more data if needed
            player_details: player.player_id, // Include player details
            performance: performanceMetrics,
            ewma_score: performanceMetrics.wickets_scored_avg // Ensure this includes the EWMA score
        });
    }
  
    // Sort by EWMA score in descending order
    playerPerformances.sort((a, b) => b.ewma_score - a.ewma_score);
  
    return playerPerformances;  // Return full player performances including EWMA scores
}


  async function getPlayerPerformanceMetricsBowlers(playerId) {
    // Fetch data without sorting by populated field
    const performances = await ScoreCard.find({ player_id: playerId })
      .populate({
        path: 'match_id',
        select: 'match_date' // Ensure this populates correctly
      });
  
    // Convert dates and sort manually
    const sortedPerformances = performances.map(performance => ({
      score: performance.wickets_taken,
      date: new Date(performance.match_id.match_date) // Make sure dates are correctly formatted
    })).sort((a, b) => b.date - a.date); // Sort descending by date
  
    //console.log(sortedPerformances)
    return {
      wickets_scored_avg: calculateDecayMovingAverageBowlers(sortedPerformances, 0.5),
    };
  }

  function calculateDecayMovingAverageBowlers(data, alpha) {
    let weightedSum = 0;
    let totalWeights = 0;
    let currentDate = new Date();
   
  
    for (const item of data) {

      const daysSinceMatch = (currentDate - new Date(item.date)) / (1000 * 3600 * 24);
      const decayWeight = Math.exp(-alpha * daysSinceMatch);
      weightedSum += item.score * decayWeight;
      totalWeights += decayWeight;
    }

    console.log(weightedSum / totalWeights);
  
    return weightedSum / totalWeights;
  }
