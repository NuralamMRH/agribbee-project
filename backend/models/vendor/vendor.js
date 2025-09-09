const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPackage",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  membershipExpiry: {
    type: Date,
    required: false, // Set when a vendor's membership will expire
  },
  // Add other relevant fields as needed
});

// Relations (Virtuals)
vendorSchema.virtual("subscription", {
  ref: "SubscriptionPackage",
  localField: "membership",
  foreignField: "_id",
});

vendorSchema.virtual("auctioneer", {
  ref: "Auctioneer",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("platinum_member", {
  ref: "Platinum",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("kiosk", {
  ref: "Kiosk",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("retailer", {
  ref: "Retailer",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("order_transaction", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("todays_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "vendor_id",
  match: { createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } },
});

vendorSchema.virtual("this_week_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "vendor_id",
  match: {
    createdAt: {
      $gte: new Date().setDate(new Date().getDate() - new Date().getDay()),
      $lt: new Date().setDate(new Date().getDate() + (6 - new Date().getDay())),
    },
  },
});

vendorSchema.virtual("this_month_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "vendor_id",
  match: {
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  },
});

vendorSchema.virtual("withdraw_requests", {
  ref: "WithdrawRequest",
  localField: "_id",
  foreignField: "vendor_id",
});

vendorSchema.virtual("wallet", {
  ref: "UserWallet",
  localField: "_id",
  foreignField: "vendor_id",
  justOne: true,
});

// To include virtuals in JSON and Object responses
vendorSchema.set("toObject", { virtuals: true });
vendorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Vendor", vendorSchema);
