const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  gateway: String,
  gateway_title: String,
  gateway_image: String,
  gateway_image_full_url: String,
});

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
