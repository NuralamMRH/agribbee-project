const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminWalletSchema = new Schema(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Export the AdminWallet model
module.exports = mongoose.model("AdminWallet", AdminWalletSchema);
