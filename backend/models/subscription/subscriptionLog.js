const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionLogSchema = new Schema(
  {
    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    delivery_man_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan",
    },
    paused: { type: Boolean },
    date: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubscriptionLog", subscriptionLogSchema);
