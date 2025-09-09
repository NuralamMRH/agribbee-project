const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletBonusSchema = new Schema({
  bonus_amount: { type: Number, default: 0 },
  minimum_add_amount: { type: Number, default: 0 },
  maximum_bonus_amount: { type: Number, default: 0 },
  status: { type: Number, default: 1 },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
});

// Translation logic can be managed similarly
WalletBonusSchema.virtual("translations", {
  ref: "Translation",
  localField: "_id",
  foreignField: "translationable_id",
});

// Active scope equivalent
WalletBonusSchema.statics.active = function () {
  return this.find({ status: 1 });
};

// Running scope equivalent
WalletBonusSchema.statics.running = function () {
  return this.find({
    $and: [
      { $or: [{ end_date: { $gte: new Date() } }, { end_date: null }] },
      { $or: [{ start_date: { $lte: new Date() } }, { start_date: null }] },
    ],
  });
};

module.exports = mongoose.model("WalletBonus", WalletBonusSchema);
