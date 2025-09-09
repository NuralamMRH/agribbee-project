const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSubscriptionSchema = new Schema(
  {
    expiry_date: { type: Date },
    price: { type: Number },
    validity: { type: Number },
    chat: { type: Number },
    review: { type: Number },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPackage",
    },
    status: { type: Number },
    pos: { type: Number },
    default: { type: Number },
    mobile_app: { type: Number },
    total_package_renewed: { type: Number },
    self_delivery: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    max_order: { type: String },
    max_product: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", userSubscriptionSchema);
