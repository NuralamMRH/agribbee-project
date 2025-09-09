const mongoose = require("mongoose");

const LanguageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

module.exports = mongoose.model("Language", LanguageSchema);
