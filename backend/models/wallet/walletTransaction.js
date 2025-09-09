const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  delivery_man_id: { type: Schema.Types.ObjectId, ref: "DeliveryMan" },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 },
  admin_bonus: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  reference: { type: String },
  created_at: { type: String },
});

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
