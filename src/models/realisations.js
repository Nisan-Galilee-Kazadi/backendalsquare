const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String, // visitorId ou nom
  text: String,
  date: { type: Date, default: Date.now },
});

const realisationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  imageUrls: [String], // plusieurs images
  date: { type: Date, default: Date.now },
  likes: [{ visitorId: String, date: Date }], // tracking des likeurs
  comments: [commentSchema],
});

module.exports = mongoose.model("Realisation", realisationSchema);
