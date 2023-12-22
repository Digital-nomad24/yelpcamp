if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}
// console.log(process.env.CLOUDINARY_SECRET)
// console.log(process.env.CLOUDINARY_KEY)
const express=require('express')
const path=require('path')
const morgan=require('morgan')
const mongoose=require('mongoose')
const ejsMate=require('ejs-mate')
const Campground=require('./models/campground')
const methodoverride=require('method-override')
const AppError=require('./models/AppError')
const asynccatch=require('./models/asynccatch')
const joi=require('joi')
const {reviewSchema}=require('./views/schemas')
const {campgroundschema}=require('./views/schemas')
const { appendFile } = require('fs')
const Review=require('./models/review')
const camproutes=require('./routes/campground')
const reviewroutes=require('./routes/review')
const userroutes=require('./routes/users')
const flash=require('connect-flash')
const session=require('express-session')
const passlocmon=require('passport-local-mongoose')
const passport=require('passport')
const pass_local=require('passport-local')
const User=require('./models/User')
const checklogin=require('./middleware')
const multer=require('multer')
const upload=multer({dest:'uploads/'}) 
const sanitize=require('express-mongo-sanitize')
const dburl='mongodb://127.0.0.1:27017/yelpcamp';
const MongoDbStore = require('connect-mongo')

// console.log(dburl)
// mongodb://127.0.0.1:27017/yelpcamp'
mongoose.connect(dburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(console.log("CONNECTION IS OPEN"))
.catch(err => console.log(err));
const app=express()
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
// app.use(morgan('common'))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
const store = MongoDbStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret:'randomsecret'
    }
});
store.on('error',function(e){
    console.log("session store error",e)
})
const sessionConfig={
    store,
    secret:'randomsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        Expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
//session 
app.use(session(sessionConfig))
//flash
app.use(flash())
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new pass_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    // console.log(Date.now())
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})
app.use(sanitize())
//
app.use('/campgrounds',camproutes)
app.use('/',reviewroutes)
app.use('/',userroutes)

// const verify=(req,res,next)=>{
//     if(pass=='naksh')
//     next();
//     else 
//     res.send("SORRY WRONG PASSWORD")
// }

// const validateapp=(req,res,next)=>{
//     const {error}=campgroundschema.validate(req.body)
//     // console.log(error)
//     if(error)
//     {
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new AppError(msg,400)
//     }
//     else
//     next();
// }
// const validatereview=(req,res,next)=>{
//     const{error}=reviewSchema.validate(req.body)
//     if(error)
//     {
//         const msg=error.details.map(el=>el.message).join(',')
//         throw new AppError(msg,400)
//     }
//     else
//     next();
// }
// app.get('/campgrounds',asynccatch (async(req,res,next)=>{
//    const camp= await Campground.find({})
//    res.render('home',{camp})
// }))


app.get('/new',checklogin,(req,res)=>{
    res.render('create')
})  


// app.get('/register',(req,res)=>{
//     res.render('register')
// })
// app.post('/register',async(req,res)=>{
//     const{username,email,password}=req.body;
//     const user=new User({username:username,email:email})
//     const newuser=await User.register(user,password)
//     res.send("USER REGISTERED")
// })



// app.post('/campgrounds',validateapp, asynccatch (async(req,res,next)=>{
//     const newd= await new Campground(req.body.campground)
//     await newd.save()
//     res.redirect( `campgrounds/${newd._id}`)  
// }))
// app.get('/campgrounds/:id', asynccatch(async(req,res,next)=>{
//     const {id}=req.params
//     const find= await Campground.findById(id).populate('reviews')
//     console.log(find)
//     res.render('show',{find})
// }))
// app.post('/campgrounds/:id/reviews',validatereview,asynccatch(async(req,res)=>{
//     const {id}=req.params;
//     const campground=await Campground.findById(id)
//     console.log(campground)
//     const review=await new Review(req.body.review)
//     console.log(review)
//     campground.reviews.push(review)
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${id}`)
// }))

// app.get('/campgrounds/:id/update',asynccatch (async(req,res)=>{
//     const {id}=req.params
//     const find= await Campground.findById(id)
//     res.render('update',{find})
// }))
// app.put('/campgrounds/:id',validateapp, asynccatch (async(req,res,next)=>{
//     const {id}=req.params
//     const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true,runValidators:true})
//     campground.save()
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.delete('/campgrounds/:id/reviews/:reviewid',asynccatch (async(req,res)=>{
//     const {id,reviewid}=req.params
//     await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
//     await Review.findByIdAndDelete(reviewid)
//     res.redirect(`/campgrounds/${id}`)
// }))
app.get('/',asynccatch (async(req,res)=>{
    res.render('start')
}))

// app.all('*',(req,res,next)=>{
//     next(new AppError('Page not found',401))
// })
app.use((err,req,res,next)=>{
    const{status=500}=err
    if(!err.message) err.message="SOMETHING WENT WRONG"
    console.log(err)
    res.status(status).render('error',{err})
})
// app.get('/user',async(req,res)=>{
//     const user= new User({email:"abc.com",username:'naksh'})
//     const newuser= await User.register(user,'password')
//     res.send(newuser)
// })


// app.delete('/campgrounds/:id',asynccatch(async (req,res)=>{
//     const{id}=req.params
//     const review=await Campground.findByIdAndDelete(id)
//      res.redirect('/campgrounds')
// }))
app.listen(3000,()=>{
    console.log("THE PORT 3000 is live ")
})