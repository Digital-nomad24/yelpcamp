
const joi=require('joi')
// const validatecamp=(req,res,next)=>{
//     const campgroundschema=joi.object({
//         campground:joi.object({
//             title:joi.string().required(),
//             price:joi.number().required().min(0),
//             description:joi.string().required(),
//             location:joi.string().required()
//         }).required()
//     })
// }
// module.exports=validatecamp
module.exports.campgroundschema=joi.object({
    campground:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        description:joi.string().required(),
        location:joi.string().required(),
        images:joi.string()
    }),
        deletedImages:joi.array()
})
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required(),
        body:joi.string().required()
    }).required()
})