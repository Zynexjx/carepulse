const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema(
  {
    theater_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    doctor: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    operation_type: { type: String, required: true },
    nextOfKin: { type: String, required: true },
    bp: { type: String, required: true },
    complications: { type: String, default: "" },
    otherOperationDone: { type: String, default: "" },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    fees: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theater", TheaterSchema);
