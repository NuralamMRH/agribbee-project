const mongoose = require("mongoose");

const SocialMediaSchema = new mongoose.Schema({
  id: Number,
  name: String,
  link: String,
  status: Boolean,
});

module.exports = mongoose.model("SocialMedia", SocialMediaSchema);
