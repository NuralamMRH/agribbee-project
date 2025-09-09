const RestaurantConfigSchema = new Schema({
  customer_order_date: { type: Number },
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" },
  customer_date_order_status: { type: Boolean },
  instant_order: { type: Boolean },
});

module.exports = mongoose.model("RestaurantConfig", RestaurantConfigSchema);
