const mongoose = require("mongoose");

const RadiologySchema = new mongoose.Schema(
  {
    radiology_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    doctor: { type: String, required: true },
    scanType: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: "" },
    fees: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Radiology", RadiologySchema);
