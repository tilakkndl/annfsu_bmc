import jwt from 'jsonwebtoken'; 
import Admin from '../model/adminModel.js';


const protectsAdmin = async(req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access'
        }); 
        
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await Admin.findById(decoded.id);
    req.user = currentUser;
    next();
}


const restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to perform this action",
        });
      }
      next();
    };
  };

export {protectsAdmin, restrictTo};