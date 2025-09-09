const mongoose = require("mongoose");
const { Schema } = mongoose;

const deliveryManWalletSchema = new Schema({
  delivery_man_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryMan",
    required: true,
  },
  collected_cash: { type: Number, default: 0.0 },
  total_earning: { type: Number, default: 0.0 },
  total_withdrawn: { type: Number, default: 0.0 },
  pending_withdraw: { type: Number, default: 0.0 },
});

const DeliveryManWallet = mongoose.model(
  "DeliveryManWallet",
  deliveryManWalletSchema
);
module.exports = DeliveryManWallet;
