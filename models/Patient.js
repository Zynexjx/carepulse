const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: String,
  surname: String,
  sex: String,
  age: Number,
  diagnosis: String,
  section: {
    type: String,
    enum: ["emergency","appointment","rehab"]
  }
},{timestamps:true});

module.exports = mongoose.model("Patient", PatientSchema);