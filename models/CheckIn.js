const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  username: String,
  mood: Number,
  stress: Number,
  feelings: String,
  userId: String,
 createdAt: { type: Date, default: Date.now },
 
});
checkInSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
module.exports = mongoose.model("CheckIn", checkInSchema);
