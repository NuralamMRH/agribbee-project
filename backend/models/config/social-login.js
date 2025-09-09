const mongoose = require("mongoose");

const SocialLoginSchema = new mongoose.Schema({
  login_medium: String,
  status: Boolean,
  client_id: String,
});

module.exports = mongoose.model("SocialLoginMethods", SocialLoginSchema);
