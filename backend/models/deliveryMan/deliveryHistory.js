const DeliveryHistorySchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    deliveryman_id: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryMan",
      required: true,
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Delivery Man relationship
DeliveryHistorySchema.virtual("delivery_man", {
  ref: "DeliveryMan",
  localField: "deliveryman_id",
  foreignField: "_id",
  justOne: true,
});

// Export the DeliveryHistory model
module.exports = mongoose.model("DeliveryHistory", DeliveryHistorySchema);
