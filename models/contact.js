const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    phoneNo:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    linkId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contact",
        default:null,
    },
    linkPrecedence:{
        type:String,
        enum:["primary","secondary"],
        default:"primary",
    }
}, {timestamps: true});


module.exports = mongoose.model("Contact",contactSchema);