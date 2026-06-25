const userModel = require('../models/user.model')
const blacklistModel = require("../models/blacklist.model")
const redis = require("../consfig/cache")
const jwt = require("jsonwebtoken")

async function authUser(req, res, next){
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({
      message:"Token not provided"
    })
  }

 
  let isTokenblacklisted
 try {
  isTokenblacklisted = await redis.get(token);
  console.log("Value:", isTokenblacklisted);
} catch (err) {
  console.log("Redis Error:", err);
}
  if(isTokenblacklisted){
    return res.status(401).json({
      message:"Invalid token"
    })
  }
  try{
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    )
    req.user = decoded
    next()
  }catch(err){
    return res.status(401).json({
      message:"invalid token"
    })
  }
}

module.exports =authUser
