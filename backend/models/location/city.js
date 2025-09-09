const mongoose = require("mongoose");

// Define the schema structure for multilingual content
const translatedFields = {};
const languages = ["vi", "en"]; // Example language config, you can fetch this dynamically

languages.forEach((lang) => {
  translatedFields[lang] = {
    name: { type: String, required: false },
  };
});

const dataSchema = new mongoose.Schema({
  ...translatedFields,
  zip: { type: String, required: false },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  minimum_order: { type: Number, required: false },
  commission: { type: Number, required: false },
  tax: { type: Number, required: false },
  announcement: { type: String, required: false },
  minimum_shipping_charge: { type: Number, required: false },
  per_km_shipping_charge: { type: Number, required: false },
  maximum_shipping_charge: { type: Number, required: false },

  // Geospatial location for coordinates
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: "2dsphere",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a 2dsphere index for location
dataSchema.index({ location: "2dsphere" });

// Virtual fields for associations
dataSchema.virtual("markets", {
  ref: "Market",
  localField: "_id",
  foreignField: "city._id",
});

dataSchema.virtual("kiosks", {
  ref: "Kiosk",
  localField: "_id",
  foreignField: "",
});

dataSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "address.city._id",
});

dataSchema.virtual("deliverymen", {
  ref: "DeliveryMan",
  localField: "_id",
  foreignField: "address.city._id",
});

module.exports = mongoose.model("City", dataSchema);
