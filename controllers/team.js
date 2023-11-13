const Team = require("../models/teams");
const User = require("../models/TeamPlayers");
const jwt = require("jsonwebtoken");
const TeamPlayers = require("../models/TeamPlayers");
const mongoose = require("mongoose");

exports.createTeam = async (req, res) => {
  const isnewTeam = await Team.verifyUniqueTeam(req.body.name);
  if (!isnewTeam)
    return res.json({
      success: false,
      message: "This team name is in use. Try another name",
    });
  try {
    const team = new Team(req.body);
    const newteam = await team.save();

    const addTeamPlayer = new TeamPlayers({
      team_id: newteam._id,
      player_id: req.body.captain_id,
    });
    const playerAdded = await addTeamPlayer.save();
    res.status(201).json({ success: true, newteam });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.myTeams = async (req, res) => {
  // const inTeams= await TeamPlayers.find({player_id:req.params.user_id})

  // const my_teams=Team.find()

  const my_teams = await TeamPlayers.aggregate([
    {
      $lookup: {
        from: "teams",
        localField: "team_id",
        foreignField: "_id",
        as: "myteams",
      },
    },
    {
        $unwind:"$myteams"
    },
    {
       $match: { player_id: new mongoose.Types.ObjectId( req.params.user_id) }// Convert user_id to ObjectId
     },
  ]);

  res.json({ sucess: true, UserId: req.params.user_id, my_teams: my_teams });
};
