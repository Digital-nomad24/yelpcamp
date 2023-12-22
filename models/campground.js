const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Review=require('./review')
const User=require('./User')
const { campgroundschema } = require('../views/schemas')
const ImageSchema=new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const opt={toJSON :{virtuals:true}};
const campschema=new Schema({
    title:{
        type:String,
        required:true 
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    description:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    images:[ImageSchema],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opt)
campschema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this.id}">${this.title}</a>`
})
campschema.post('findOneAndDelete',async function(doc){
    // console.log("HO GYA DELETE")
    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('Campground',campschema)
