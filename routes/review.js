const express=require('express')
const router=express.Router()
const AppError=require('../models/AppError')
const asynccatch=require('../models/asynccatch')
const Campground=require('../models/campground')
const {reviewSchema}=require('../views/schemas')
const Review=require('../models/review')
const checklogin=require('../middleware')
const review=require('../controllers/controllers(review)')
// const checklogin=require('../middleware')

const checkreviewauthor= async(req,res,next)=>{
    const {id,reviewid}=req.params
    const review=await Review.findById(reviewid)
    if (!review.author.equals(req.user._id))
    {
        req.flash("error",'you dont have the permission for that ')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
const validatereview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body)
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }
    else
    next();
}
// 
router.post('/campgrounds/:id/reviews',checklogin,validatereview,asynccatch(review.submitReview))
router.delete('/campgrounds/:id/reviews/:reviewid',checkreviewauthor,asynccatch(review.deleteReview))
module.exports=router