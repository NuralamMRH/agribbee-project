const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WithdrawRequestSchema = new Schema({
  amount: { type: Number, default: 0 },
  delivery_man_id: { type: Schema.Types.ObjectId, ref: "DeliveryMan" },
  withdrawal_method_id: {
    type: Schema.Types.ObjectId,
    ref: "WithdrawalMethod",
  },
  approved: { type: Number, default: 0 },
  admin_id: { type: Schema.Types.ObjectId, ref: "Admin" },
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor" },
});

// ZoneScope equivalent
WithdrawRequestSchema.pre("find", function () {
  this.where({ market_id: some_zone_condition });
});

// To include the virtuals when converting to JSON or Object
WithdrawRequestSchema.set("toObject", { virtuals: true });
WithdrawRequestSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("WithdrawRequest", WithdrawRequestSchema);
