const {check,validationResult}=require('express-validator')

exports.validateUserSignup=[
    check('first_name').trim().not().isEmpty().withMessage('name is required').isAlpha().withMessage('Name must not contain numbers')
    .isLength({min:5,max:50}).withMessage("name must be within 5 to 50 characters"),
    check('last_name').trim().not().isEmpty().isString(),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password').trim().not().isEmpty().isLength({min:5,max:30}).withMessage("password must be within 5 to 30 characters"),
    check('confirmPassword').trim().not().isEmpty().custom((value,{req})=>{
       if(value!=req.body.password){
        throw new Error('Both passwords must be same')
       }
       return true;
    })

]

exports.userValidations=(req,res,next)=>{
    const results=validationResult(req).array();
   if(!results.length) return next();

   //const error = results.map(res => res.msg); for sending all errors

const error=results[0].msg; //for sending the first error message
   res.json({'success':false,message:error})
   
}

exports.validateUserSignIn=[
   check('email').trim().isEmail().withMessage('Invalid email'),
   check('password').trim().not().isEmpty().withMessage("Email/password is required")
]