const SubscriptionScheduleSchema = new Schema({
  subscription_id: { type: Schema.Types.ObjectId, ref: "Subscription" },
  day: { type: Number },
});

module.exports = mongoose.model(
  "SubscriptionSchedule",
  SubscriptionScheduleSchema
);
