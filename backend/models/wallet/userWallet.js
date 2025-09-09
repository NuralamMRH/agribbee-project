const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userWalletSchema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    total_earning: { type: Number },
    total_withdrawn: { type: Number },
    pending_withdraw: { type: Number },
    collected_cash: { type: Number },
  },
  {
    timestamps: true,
  }
);

userWalletSchema.virtual("balance").get(function () {
  if (this.total_earning <= 0) {
    return 0;
  }
  return parseFloat(
    (
      this.total_earning -
      (this.total_withdrawn + this.pending_withdraw + this.collected_cash)
    ).toFixed(8)
  );
});

module.exports = mongoose.model("UserWallet", userWalletSchema);
