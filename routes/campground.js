const express=require('express')
const router=express.Router()
const Campground=require('../models/campground')
const campgrounds=require('../controllers/controllers(campgrounds)')
const AppError=require('../models/AppError')
const asynccatch=require('../models/asynccatch')
const {campgroundschema}=require('../views/schemas')
const checklogin=require('../middleware')
// const flash=require('connect-flash')
// router.use(flash())
const multer=require('multer')
const {storage}=require('../cloudinary/index')
const upload=multer({storage}) 

const validateapp=(req,res,next)=>{
    const {error}=campgroundschema.validate(req.body)
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }
    else
    next();
}
const checkauthor= async(req,res,next)=>{
    const {id}=req.params
    const campg=await Campground.findById(id)
    if (!campg.author.equals(req.user._id))
    {
        req.flash("error",'you dont have the permission for that ')
        return res.redirect(`/campgrounds/${campg._id}`)
    }
    next();
}
router.route('/')
    .get(asynccatch(campgrounds.index)) 
    .post(checklogin,validateapp,upload.array('image'),(campgrounds.create))
    
router.route('/:id')
    .get( asynccatch(campgrounds.renderById))
    .put(checklogin,checkauthor,upload.array('image'),validateapp,asynccatch(campgrounds.updateCamp))
    .delete(checklogin,checkauthor,asynccatch(campgrounds.deleteCamp))    

router.get('/:id/update',checklogin,checkauthor,asynccatch(campgrounds.getupdateform))

module.exports=router;