const mongoose = require("mongoose");

const languages = require("../../config/languages");

// Function to dynamically create the Market schema based on the languages in the config

const translatedFields = {};

languages.forEach((lang) => {
  translatedFields[lang] = {
    name: { type: String, required: false },
    description: { type: String, required: false },
    meta_title: {
      type: String,
      required: false,
    },
    meta_description: {
      type: String,
      required: false,
    },
    announcement_message: {
      type: String,
      required: false,
    },
  };
});

const marketSchemaModel = new mongoose.Schema({
  ...translatedFields,
  image: { type: String, required: true },
  image_full_url: { type: String, required: false },
  banner: { type: String, required: false },
  banner_full_url: { type: String, required: false },
  market_video: { type: String, required: false },
  market_video_full_url: { type: String, required: false },
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
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  marketFloor: {
    type: Number,
    default: 0,
  },
  marketStores: {
    type: Number,
    default: 0,
  },
  floorWiseStores: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 1,
  },
  slug: { type: String, required: false, unique: true },

  meta_image: {
    type: String,
    required: false,
  },
  announcement: {
    type: Boolean,
    default: false,
  },

  qr_code: {
    type: String,
    required: false,
  },
  additional_data: {
    type: String,
    required: false,
  },
  kiosk_count: {
    type: Number,
    default: 0,
  },
  minimum_order: { type: Number, required: false },
  commission: { type: Number, required: false },
  tax: { type: Number, required: false },
  minimum_shipping_charge: { type: Number, required: false },
  per_km_shipping_charge: { type: Number, required: false },
  maximum_shipping_charge: { type: Number, required: false },
  max_cod_order_amount: { type: Number, required: false },
  increased_delivery_fee: { type: Number, required: false },
  increased_delivery_fee_status: { type: Number, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Other fields you may need
});

marketSchemaModel.virtual("kiosks", {
  ref: "Seller",
  localField: "_id",
  foreignField: "address.market",
});

marketSchemaModel.virtual("campaigns", {
  ref: "Campaign",
  localField: "_id",
  foreignField: "market_id",
});

marketSchemaModel.virtual("incentives", {
  ref: "Incentive",
  localField: "_id",
  foreignField: "market_id",
  options: { sort: { earning: -1 } },
  justOne: false,
});

// Slug Generation
marketSchemaModel.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    // Try to generate the slug from the 'vi' name first
    let nameToSlugify = this.vi?.name || this.en?.name; // Primary language is 'vi', fallback is 'en'

    if (nameToSlugify) {
      this.slug = await this.generateSlug(nameToSlugify);
    }
  }
  next();
});

marketSchemaModel.methods.generateSlug = async function (name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, ""); // Replace spaces and special characters
  const existingSlug = await this.constructor
    .findOne({ slug: new RegExp(`^${slug}`, "i") })
    .sort({ _id: -1 });

  if (existingSlug) {
    const lastSlug = existingSlug.slug;
    const slugParts = lastSlug.split("-");
    const lastCount = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(lastCount)) {
      slug = `${slug}-2`; // Append '-2' if there's no numeric suffix
    } else {
      slug = `${slug}-${lastCount + 1}`; // Increment the numeric suffix
    }
  }

  return slug;
};

marketSchemaModel.methods.setLocationCoordinates = function (lat, lng) {
  this.location.coordinates = [parseFloat(lng), parseFloat(lat)];
};

module.exports = mongoose.model("Market", marketSchemaModel);
