const jwt = require("jsonwebtoken");
const Org = require("../models/organization");
exports.isOrgAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

try {
    
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const org = await Org.findById(decode.orgId);
    if (!org) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

        req.org=org;
        next();
    
} catch (error) {
    if(error.name==='JsonWebTokenError'){
        return res.json({success:false,message:'Unauthorized access'})
    }
    if(error.name==='TokenExpiredError'){
        return res.json({success:false,message:'Session expired. Try signin again'})
    }

    return res.json({success:false,message:'Internal server error'})
}

}else{
    return res.json({success:false,message:'No token available'})

}

}

