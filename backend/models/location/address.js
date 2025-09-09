const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  address_type: { type: String, required: true },
  address_label: { String },
  floor: { type: String },
  house: { type: String },
  road: { type: String },
  street: { type: String },
  address: { type: String, required: false },
  zip: { type: String },
  city: { type: Schema.Types.ObjectId, ref: "City", required: false },
  region: { type: Schema.Types.ObjectId, ref: "Region", required: false },
  country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
  contact_person_email: { type: String },
  contact_person_number: { type: String },
  contact_person_name: { type: String },
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
  isDefault: { type: Schema.Types.Boolean, required: false },
});

// Create a 2dsphere index for location
AddressSchema.index({ location: "2dsphere" });

// Relationships
AddressSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
});

AddressSchema.virtual("markets", {
  ref: "Market",
  localField: "market",
  foreignField: "_id",
});
AddressSchema.virtual("Cities", {
  ref: "City",
  localField: "city",
  foreignField: "_id",
});
AddressSchema.virtual("regions", {
  ref: "Region",
  localField: "region",
  foreignField: "_id",
});

// To include the virtuals when converting to JSON or Object
AddressSchema.set("toObject", { virtuals: true });
AddressSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Address", AddressSchema);
