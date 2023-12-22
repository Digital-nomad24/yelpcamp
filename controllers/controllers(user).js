const User=require('../models/User')
module.exports.getloginform=(req,res)=>{
    res.render('login')
}
module.exports.submitlogin=(req,res)=>{
    req.flash('success','Welcome back guys')
    res.redirect('/campgrounds')
}
module.exports.getRegisterForm=(req,res)=>{
    res.render('register')
}
module.exports.Logout=(req, res, next)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success',"Logged Out")
      res.redirect('/campgrounds');
    });
}
module.exports.submitRegister=(async(req,res)=>{
    try{
    const{username,email,password}=req.body;
    const user=new User({username,email})
    const newuser=await User.register(user,password)
    req.login(newuser,err=>{
        if(err)
        console.log(err)
    })
    req.flash('success','Welcome')
    res.redirect('/campgrounds')
    }catch(e){
        console.log(e.message)
        req.flash('error',e.message)
        res.redirect('/register')
    }
})