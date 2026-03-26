const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["admin","doctor","nurse","reception","supervisor"],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
},{ timestamps:true });

module.exports = mongoose.model("User", UserSchema);