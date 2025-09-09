const mongoose = require("mongoose");
const language = require("../config/language");
const ErrorHandler = require("../../utils/errorHandler");
const languages = require("../../config/languages");

const translatedFields = {};

languages.forEach((lang) => {
  translatedFields[lang.key] = {
    name: { type: String, required: true },
  };
});

const RegionSchema = new mongoose.Schema({
  ...translatedFields,
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  position: { type: Number, required: false },
  minimum_order: { type: Number, required: false },
  commission: { type: Number, required: false },
  tax: { type: Number, required: false },
  announcement: { type: String, required: false },
  minimum_shipping_charge: { type: Number, required: false },
  per_km_shipping_charge: { type: Number, required: false },
  maximum_shipping_charge: { type: Number, required: false },
  // Other fields you may need
});

RegionSchema.virtual("cities", {
  ref: "City",
  localField: "_id",
  foreignField: "region",
});

RegionSchema.virtual("kiosks", {
  ref: "Seller",
  localField: "_id",

  foreignField: "address.region._id",
  match: { seller_type: "kiosk" },
});

RegionSchema.virtual("deliverymen", {
  ref: "DeliveryMan",
  localField: "_id",
  foreignField: "address.region._id",
});

RegionSchema.set("toObject", { virtuals: true });
RegionSchema.set("toJSON", { virtuals: true });

// To include the virtuals when converting to JSON or Object
RegionSchema.set("toObject", { virtuals: true });
RegionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Region", RegionSchema);
