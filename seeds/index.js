const mongoose=require('mongoose')
const cities=require('./cities')
const Campground=require('../models/campground')
const {places,descriptors}=require('./seedhelp')
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
 .then(console.log("database connected"))
 .catch(err => console.log(err));
//  const camp=new Campground({title:"aligarh",price:'23412',description:'Small yard',location:'UP'})
//  camp.save()
//  .then(res=>{
//     console.log(res)
//     console.log("DONE")
//  })
//  .catch(err=>{
//     console.log("ERROR")
//  })
const sample= (array=>array[Math.floor(Math.random()*array.length)])
const seeddb=async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++)
    {
        const random=Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*20)+10
        const camp=new Campground({
            location:`${cities[random].city},${cities[random].state}`,
            title:`${sample(descriptors)},${sample(places)}`,
            price,
            geometry:{
              type:"Point",
              coordinates:[
                cities[random].longitude,
                cities[random].latitude,
              ]
            },
            author:"654bc13e3a263c630d8596d4",
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, sunt ipsam, consectetur cupiditate distinctio dolores odit nisi dicta quidem rem ab architecto provident. Incidunt sed iure blanditiis repellat harum aliquam?',
            images: [
                {
                  url:'https://res.cloudinary.com/dftckm5v0/image/upload/v1699712901/Yelpcamp/ln13cf2aidsa3jhm5hrs.png',
                  filename: 'Yelpcamp/rwtmcooiv5bjbfx0ap1b'
                  
                },
                {
                  url: 'https://res.cloudinary.com/dftckm5v0/image/upload/v1699712902/Yelpcamp/k3kyelnevqhxashayujh.png',
                  filename: 'Yelpcamp/ftww7ugeneuhxfd26zrp'
                  
                },
                {
                  url:'https://res.cloudinary.com/dftckm5v0/image/upload/v1699712896/Yelpcamp/ll8mex9rnymg0cyu07pc.png',
                  filename: 'Yelpcamp/patmramgerrzqcvail5i'
                  
                }
              ]
        })
        await camp.save()
    }
}
seeddb()
