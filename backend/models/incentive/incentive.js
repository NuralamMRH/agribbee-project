const IncentiveSchema = new Schema({
  city_id: { type: Schema.Types.ObjectId, ref: "City", required: true },
  earning: { type: Number, default: 0 },
  incentive: { type: Number, default: 0 },
});

module.exports = mongoose.model("Incentive", IncentiveSchema);
