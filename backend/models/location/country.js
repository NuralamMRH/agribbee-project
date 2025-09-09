const mongoose = require("mongoose");
const ErrorHandler = require("../../utils/errorHandler");
const language = require("../config/language");

// const Config = require("./index");
const translatedFields = {};
const languages = ["vi", "en"]; // Example language config, you can fetch this dynamically

languages.forEach((lang) => {
  translatedFields[lang] = {
    name: { type: String, required: false },
  };
});

const CountrySchema = new mongoose.Schema({
  ...translatedFields,
  countryCode: { type: String, required: false },
  flag: { type: String, required: false },
  flag_full_url: { type: String, required: false },
  currency: { type: String, required: true },
  language: { type: String, required: true },
  // Other fields you may need
});

CountrySchema.virtual("cities", {
  ref: "City",
  localField: "_id",
  foreignField: "country._id",
});

CountrySchema.virtual("markets", {
  ref: "Market",
  localField: "_id",
  foreignField: "address.country._id",
});

CountrySchema.virtual("kiosks", {
  ref: "Kiosk",
  localField: "_id",
  foreignField: "address.country._id",
});

CountrySchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "address.country._id",
});

CountrySchema.virtual("deliverymen", {
  ref: "DeliveryMan",
  localField: "_id",
  foreignField: "address.country._id",
});

module.exports = mongoose.model("Country", CountrySchema);
