const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  codeid:String,
  name:String,
  surname:String,
  doctor:String,
  assistantNurse:String,
  sex:String,
  age:Number,
  diagnosis:String,
  operation:String,
  date:Date,
  fees:Number
},{timestamps:true});

module.exports = mongoose.model("Emergency", EmergencySchema);