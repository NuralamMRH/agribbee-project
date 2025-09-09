const DMReviewSchema = new Schema(
  {
    delivery_man_id: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryMan",
      required: true,
    },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Translations relationship

// Customer relationship
DMReviewSchema.virtual("customer", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

// Order relationship
DMReviewSchema.virtual("order", {
  ref: "Order",
  localField: "order_id",
  foreignField: "_id",
  justOne: true,
});

// Delivery Man relationship
DMReviewSchema.virtual("delivery_man", {
  ref: "DeliveryMan",
  localField: "delivery_man_id",
  foreignField: "_id",
  justOne: true,
});

// Active scope
DMReviewSchema.statics.active = function () {
  return this.find({ status: 1 });
};

// Export the DMReview model
module.exports = mongoose.model("DMReview", DMReviewSchema);
