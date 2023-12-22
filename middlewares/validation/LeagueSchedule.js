const {check,validationResult}=require('express-validator')

exports.validateLeagueSchedule=[
    check('league_id').not().isEmpty().isString(),
    check('team1_id').not().isEmpty().withMessage("Team required"),
    check('team2_id').not().isEmpty().withMessage("Team required"),
    check('venue').trim().not().isEmpty().withMessage("Venue must be string").isString(),
    check('match_date').not().isEmpty().withMessage('Match Date is required')
   

]

exports.LeagueScheduleValidations=(req,res,next)=>{
    const results=validationResult(req).array();
   if(!results.length) return next();

   //const error = results.map(res => res.msg); for sending all errors

const error=results[0].msg; //for sending the first error message
   res.json({'success':false,message:error})
   
}
