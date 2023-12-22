const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const reviewSchema= new Schema({
    body:String,
    rating:{
        type:Number,
        min:0
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});
const Review= new mongoose.model("Review",reviewSchema)
module.exports=Review;