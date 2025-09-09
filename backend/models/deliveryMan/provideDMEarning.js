const ProvideDMEarningSchema = new Schema({
  delivery_man_id: { type: Schema.Types.ObjectId, ref: "DeliveryMan" },
});

// Add Zone Scope Global Hook
ProvideDMEarningSchema.pre(/^find/, function (next) {
  // Add zone scope logic here
  next();
});

module.exports = mongoose.model("ProvideDMEarning", ProvideDMEarningSchema);
