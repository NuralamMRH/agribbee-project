const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidSchema = new Schema(
  {
    auction_id: { type: Schema.Types.ObjectId, ref: "Auction" },
    bid_by: { type: String, default: "per_quantity" }, //quantity, per_weight_unit,
    bid_amount: { type: Number, required: true },
    bid_weight_unit_name: { type: String, default: "Kg" },
    bid_weight: { type: Number },
    bid_quantity: { type: Number },
    total_tax_amount: { type: Number },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller" },
    scheduled: { type: Boolean, default: false },
    bid_status: {
      type: String,
      enum: ["pending", "accepted", "processing", "canceled", "failed"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
    auction_end_date: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Scopes
BidSchema.statics.pending = function () {
  return this.find({ bid_status: "pending" });
};

BidSchema.statics.accepted = function () {
  return this.find({ bid_status: "accepted" });
};

BidSchema.virtual("logs", {
  ref: "Log",
  localField: "_id",
  foreignField: "bid_id",
  justOne: false,
});

BidSchema.virtual("auction", {
  ref: "Auction",
  localField: "auction_id",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Bid", BidSchema);
