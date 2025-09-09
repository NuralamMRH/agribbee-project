const mongoose = require("mongoose");

// Define the schema structure for multilingual content
const translatedFields = {};
const languages = ["vi", "en"]; // Example language config

languages.forEach((lang) => {
  translatedFields[lang] = {
    name: { type: String },
    tagLine: {
      type: String,
    },
    introduction: { type: String },

    description: { type: String },
  };
});

// Define the subscription package schema
const subscriptionPackageSchema = new mongoose.Schema({
  ...translatedFields,
  type: {
    type: String,
  },
  price: { type: Number, required: true },
  icon_image: { type: String },
  icon_image_full_url: { type: String },
  features: {
    listProducts: { type: Boolean, default: false },
    bidOnAuctions: { type: Boolean, default: false },
    sellAuctionProducts: { type: Boolean, default: false },
    resellWinningBid: { type: Boolean, default: false },
    transferWinningBid: { type: Boolean, default: false },
    createAuctions: { type: Boolean, default: false },
    createMarkets: { type: Boolean, default: false },
    adCreator: { type: Boolean, default: false },
    restaurantSupplier: { type: Boolean, default: false },
    validity: { type: Number, default: 30 }, // validity in days
    chat: { type: Boolean, default: false },
    review: { type: Boolean, default: false },
    pos: { type: Boolean, default: false },
    self_delivery: { type: Boolean, default: false },
  },
  position: { type: Number, default: 0 },
  trial_period: { type: Number, default: 90 },
  subs_by: { type: String, default: "Monthly" },
  user_role: { type: String, default: "goldVVip" },
  status: { type: Boolean, default: true },
  default: { type: Number, default: 0 },
  total_package_renewed: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Relationships
subscriptionPackageSchema.virtual("transactions", {
  ref: "SubscriptionTransaction",
  localField: "_id",
  foreignField: "package_id",
  justOne: false,
});

subscriptionPackageSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "package_id",
  justOne: false,
});

subscriptionPackageSchema.set("toObject", { virtuals: true });
subscriptionPackageSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model(
  "SubscriptionPackage",
  subscriptionPackageSchema
);
