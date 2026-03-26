const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  appointment_id: String,
  name: String,
  surname: String,
  sex: String,
  age: Number,
  diagnosis: String,
  counselor: String,
  section_booking: String,
  time_period: String,
  fees: Number
},{timestamps:true});

module.exports = mongoose.model("Appointment", AppointmentSchema);