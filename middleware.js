const checklogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
    // req.session.returnTo=req.originalUrl;
    req.flash('error',"You must login")
    res.redirect('/login')
}
else
next()
}
module.exports=checklogin;

module.exports.storeReturnTo=(req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }else
    next();
}
