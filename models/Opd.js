const mongoose = require("mongoose");

const OpdSchema = new mongoose.Schema(
  {
    opd_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true },
    date: { type: Date, required: true },
    diagnosis: { type: String, required: true },
    temperature: { type: String, required: true },
    doctor: { type: String, required: true },
    bp: { type: String, required: true },
    malariaTest: {
      type: String,
      enum: ["Positive", "Negative"],
      required: true
    },
    fees: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opd", OpdSchema);
