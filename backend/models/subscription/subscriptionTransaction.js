const SubscriptionTransactionSchema = new Schema({
  package_details: { type: Array },
  id: { type: String },
  chat: { type: Number },
  review: { type: Number },
  package_id: { type: Schema.Types.ObjectId, ref: "SubscriptionPackage" },
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" },
  status: { type: Number },
  self_delivery: { type: Number },
  max_order: { type: String },
  max_product: { type: String },
  payment_method: { type: String },
  paid_amount: { type: Number },
  validity: { type: Number },
});

// Relationships
SubscriptionTransactionSchema.virtual("vendor", {
  ref: "Vendor",
  localField: "_id",
  foreignField: "_id",
  justOne: true,
});

SubscriptionTransactionSchema.virtual("package", {
  ref: "SubscriptionPackage",
  localField: "package_id",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model(
  "SubscriptionTransaction",
  SubscriptionTransactionSchema
);
