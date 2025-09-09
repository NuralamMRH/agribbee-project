const SubscriptionPauseSchema = new Schema({
  subscription_id: { type: Schema.Types.ObjectId, ref: "Subscription" },
});

// Scope for checking date
SubscriptionPauseSchema.statics.checkDate = function (startDate, endDate) {
  return this.find({
    $or: [
      { from: { $lte: startDate }, to: { $gte: startDate } },
      { from: { $lte: endDate }, to: { $gte: endDate } },
    ],
  });
};

module.exports = mongoose.model("SubscriptionPause", SubscriptionPauseSchema);
