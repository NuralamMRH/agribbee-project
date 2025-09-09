const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyingProductSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    buying_amount: { type: Number, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller" },
    buying_price_by: { type: String, default: "whole" }, //quantity, weight_unit
    buying_quantity: { type: Number, default: 0 },
    selling_quantity: { type: Number, default: 0 },
    buying_weight: { type: Number, default: 0 },
    buying_weight_unit: { type: String, default: "kg" }, // kg, g, lb, oz
    status: { type: Number, default: 1 },
    buying_product_status: {
      type: String,
      enum: ["pending", "accepted", "processing", "canceled", "failed"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Scopes
BuyingProductSchema.statics.pending = function () {
  return this.find({ buyingProduct_status: "pending" });
};

BuyingProductSchema.statics.accepted = function () {
  return this.find({ buyingProduct_status: "accepted" });
};

BuyingProductSchema.virtual("logs", {
  ref: "Log",
  localField: "_id",
  foreignField: "buying_product_id",
  justOne: false,
});

BuyingProductSchema.virtual("product", {
  ref: "Product",
  localField: "product_id",
  foreignField: "_id",
  justOne: false,
});

module.exports = mongoose.model("BuyingProduct", BuyingProductSchema);
