const Campground=require('../models/campground')
const {cloudinary}=require('../cloudinary')
const mapgeocode=require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.MAPBOX_TOKEN;
const geocoder=mapgeocode({accessToken:mapboxtoken});
module.exports.index=(async(req,res,next)=>{
    const camp= await Campground.find({})
    res.render('home',{camp})
 })
 module.exports.renderById=(async(req,res,next)=>{
    const {id}=req.params
    const find= await Campground.findById(id).populate({
       path:'reviews',
       populate:{
           path:'author'
       }
       }).populate('author')
    if(!find){
    req.flash('error','Campground not found')
    res.redirect('/campgrounds')
    }else
   //console.log(find)
    res.render('show',{find})
})
module.exports.create=(async(req,res,next)=>{
    const data=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const find= await new Campground(req.body.campground)
    find.geometry=data.body.features[0].geometry;
    find.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    find.author=req.user._id;
    await find.save()
    console.log(find)
    req.flash('success',`successfully created a campground`)
    res.redirect(`/campgrounds/${find._id}`)  
})
module.exports.getupdateform=(async(req,res)=>{
    const {id}=req.params
    const find= await Campground.findById(id)
    if(!find){
        req.flash("error",'Campgorund does not exist')
    }
    // if (!find.author.equals(req.user._id))
    // {
    //     req.flash("error",'you dont have the permission for that ')
    //     return res.redirect(`/campgrounds/${find._id}`)
    // }
    res.render('update',{find})
})
module.exports.updateCamp=(async(req,res,next)=>{
    const {id}=req.params
    console.log(req.body)
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true,runValidators:true})
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    // if (!campg.author.equals(req.user._id))
    // {
    //     req.flash("error",'you dont have the permission for that ')
    //     return res.redirect(`/campgrounds/${campg._id}`)
    // }
    await campground.save()
    if(req.body.deletedImages){
    for(let filename of req.body.deletedImages)
    {
        await cloudinary.uploader.destroy(filename)
    }
        // await Campground.updateOne({$pull:{images:{filename:{$in:req.body.deletedImages}}}})
        // console.log(campground.images)
    }
    await Campground.updateOne({$pull:{images:{filename:{$in:req.body.deletedImages}}}})
    req.flash('success','Campground Upgraded')
    res.redirect(`/campgrounds/${campground._id}`)
})
module.exports.deleteCamp=(async (req,res)=>{
    const {id}=req.params
    const campg=await Campground.findById(id)
    for(pic of campg.images){
        await cloudinary.uploader.destroy(pic.filename)
    }
    // if (!campg.author.equals(req.user._id))
    // {
    //     req.flash("error",'you dont have the permission for that ')
    //     return res.redirect(`/campgrounds/${campg._id}`)
    // }
    const check=await Campground.findByIdAndDelete(id)
    req.flash('success','Campgrounded Deleted')
    res.redirect('/campgrounds')
})