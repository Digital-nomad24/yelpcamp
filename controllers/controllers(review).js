const Review=require('../models/review')
const Campground=require('../models/campground')
module.exports.submitReview=(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id)
    // console.log(campground)
    const review=await new Review(req.body.review)
    review.author=req.user._id;
    // console.log(review)
    campground.reviews.push(review)
    await review.save();    
    await campground.save();
    req.flash('success','Review Added')
    res.redirect(`/campgrounds/${id}`)
})
module.exports.deleteReview=(async(req,res)=>{
    const {id,reviewid}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('error','Review Deleted')
    res.redirect(`/campgrounds/${id}`)
})