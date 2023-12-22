const express=require('express')
const router=express.Router()
const asynccatch=require('../models/asynccatch')
const passlocmon=require('passport-local-mongoose')
const passport=require('passport')
const pass_local=require('passport-local')
const  {storeReturnTo } = require('../middleware');
const user=require('../controllers/controllers(user)')
// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(new pass_local(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
router.get('/login',(user.getloginform))

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(user.submitlogin))

router.get('/logout',(user.Logout));

router.get('/register',(user.getRegisterForm))

router.post('/register',asynccatch(user.submitRegister))

module.exports=router;
