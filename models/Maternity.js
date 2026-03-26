const mongoose = require("mongoose");

const MaternitySchema = new mongoose.Schema(
  {
    maternity_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    doctor: { type: String, required: true },
    dateOfDelivery: { type: Date, required: true },
    deliveryType: {
      type: String,
      enum: ["Normal", "Cesarian Section"],
      required: true
    },
    deliveryTime: { type: String, required: true },
    numberOfBabies: { type: Number, required: true },
    babiesSex: { type: String, required: true },
    fees: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maternity", MaternitySchema);
