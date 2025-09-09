const IncentiveLogSchema = new Schema(
  {
    delivery_man_id: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryMan",
      required: true,
    },
    city_id: { type: Schema.Types.ObjectId, ref: "City", required: true },
    earning: { type: Number, default: 0 },
    today_earning: { type: Number, default: 0 },
    min_pay_subsidy: { type: Number, default: 0 },
    working_hours: { type: Number, default: 0 },
    incentive: { type: Number, default: 0 },
  },
  { timestamps: true }
);

IncentiveLogSchema.virtual("deliveryman", {
  ref: "DeliveryMan",
  localField: "delivery_man_id",
  foreignField: "_id",
});

IncentiveLogSchema.virtual("city", {
  ref: "City",
  localField: "city_id",
  foreignField: "_id",
});

module.exports = mongoose.model("IncentiveLog", IncentiveLogSchema);
