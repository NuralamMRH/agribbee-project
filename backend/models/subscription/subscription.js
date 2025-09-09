const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
  {
    billing_amount: { type: Number },
    paid_amount: { type: Number },
    quantity: { type: Number },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    start_at: { type: Date },
    end_at: { type: Date },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.virtual("customer", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

subscriptionSchema.virtual("logs", {
  ref: "SubscriptionLog",
  localField: "_id",
  foreignField: "subscription_id",
});

subscriptionSchema.virtual("isPausedToday").get(function () {
  return this.logs.some(
    (log) => log.paused && log.date === new Date().toISOString().split("T")[0]
  );
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
