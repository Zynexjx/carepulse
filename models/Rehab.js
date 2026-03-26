const mongoose = require("mongoose");

const RehabSchema = new mongoose.Schema({
  rehab_id: String,
  name: String,
  surname: String,
  sex: String,
  age: Number,
  diagnosis: String,
  supervisor: String,
  period: String,
  type:{
    type:String,
    enum:["threat","hostal","suicidal"]
  },
  dateOfAdmission: Date,
  fees:Number
},{timestamps:true});

module.exports = mongoose.model("Rehab", RehabSchema);