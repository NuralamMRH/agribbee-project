const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kioskTagSchema = new Schema(
  {
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SellerTag", kioskTagSchema);
