require("dotenv").config();

module.exports.isAuthorized = (req,res,next)=>{
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== "undefined"){
        const token = bearerHeader.split(" ")[1];
        if(token === process.env.NODE_ENV_AUTHENTICATION){
            console.log("passed");
            return next();
        }
    }
    res.status(403);
    return res.send("YOU ARE NOT ALLOWED");
}