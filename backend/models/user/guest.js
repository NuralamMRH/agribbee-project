const mongoose = require("mongoose");
const { Schema } = mongoose;

const GuestSchema = new Schema({
  ip_address: { type: String, required: true },
});

GuestSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user_id",
});

module.exports = mongoose.model("Guest", GuestSchema);
