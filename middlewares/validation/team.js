const {check,validationResult}=require('express-validator')

exports.validateCreateTeam=[
    check('name').trim().not().isEmpty().withMessage('name is required')
    .isLength({min:3,max:50}).withMessage("name must be within 3 to 50 characters"),
    check('slogan').trim().isString(),
    check('captain_id').isString().withMessage().not().isEmpty(),

]

exports.TeamValidations=(req,res,next)=>{
    const results=validationResult(req).array();
    console.log("At Team validations");
   if(!results.length) return next();

   //const error = results.map(res => res.msg); for sending all errors

const error=results[0].msg; //for sending the first error message
   res.json({'success':false,message:error})
   
}
