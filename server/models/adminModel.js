const mongoose=require('mongoose')


const  adminSchema=new mongoose.Schema({
            
    role:{
        type:String,
        required:true,

    },
    firstName:{
              type:String,
              required:true
    },
    lastName:{
        type:String,
              required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImageUrl:{
                 type:String 
    },
    isActive:{

        type:Boolean,
        default:true

    }
},{"strict":"throw"})



const admin= mongoose.model('admin',adminSchema)


module.exports=admin;