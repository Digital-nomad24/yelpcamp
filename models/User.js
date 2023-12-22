const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const passlocmon=require('passport-local-mongoose')
const UserSchema=new Schema({
    email:{
        type: String,
        required:true,
        unique:true
    }
});
UserSchema.plugin(passlocmon)
module.exports=mongoose.model('User',UserSchema)