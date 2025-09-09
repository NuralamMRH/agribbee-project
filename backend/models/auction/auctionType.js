const mongoose = require("mongoose");
// const language = require("../config/language");
const { Schema } = mongoose;

// Define the schema structure for multilingual content
const translatedFields = {};
const languages = ["vi", "en"]; // Example language config, you can fetch this dynamically

languages.forEach((lang) => {
  translatedFields[lang] = {
    name: { type: String, required: true },
    page_name: { type: String },
    name_tag: { type: String },
    name_brand: { type: String },
    description: { type: String },
  };
});

const AuctionTypeSchema = new Schema(
  {
    ...translatedFields, // Multilingual fields
    priority: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    products_count: { type: Number, default: 0 }, // Will be auto-updated via virtual
    slug: { type: String, unique: true }, // Slug must be unique
    image: { type: String },
    image_full_url: { type: String, unique: true },
    banners: [],
    background_image: { type: String },
    background_image_full_url: { type: String },
    icon: { type: String },
    icon_full_url: { type: String },
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: { type: String },
    meta_image: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to auto-calculate products count based on auctionType
AuctionTypeSchema.virtual("products", {
  ref: "Auction", // Assuming you have a Product model
  localField: "_id",
  foreignField: "auction_type_id",
});

// Populate `products_count` and `childes_count` before saving
AuctionTypeSchema.pre("save", async function (next) {
  const type = this;

  // Update product count
  const productsCount = await mongoose
    .model("Product")
    .countDocuments({ type: type._id });
  type.products_count = productsCount;

  // Generate slug if the name changes or it's new
  if (type.isNew || type.isModified("vi.name") || type.isModified("en.name")) {
    let nameToSlugify = type.vi?.name || type.en?.name;
    if (nameToSlugify) {
      type.slug = await type.generateSlug(nameToSlugify);
    }
  }

  next();
});

// Method to generate unique slug
AuctionTypeSchema.methods.generateSlug = async function (name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const existingSlug = await this.constructor
    .findOne({ slug: new RegExp(`^${slug}`, "i") })
    .sort({ _id: -1 });

  if (existingSlug) {
    const lastSlug = existingSlug.slug;
    const slugParts = lastSlug.split("-");
    const lastCount = parseInt(slugParts[slugParts.length - 1], 10);

    if (isNaN(lastCount)) {
      slug = `${slug}-2`; // Append '-2' if no numeric suffix
    } else {
      slug = `${slug}-${lastCount + 1}`; // Increment numeric suffix
    }
  }

  return slug;
};

// Static method to fetch active categories
AuctionTypeSchema.statics.active = function () {
  return this.find({ status: 1 });
};

// Morph relationship with users (polymorphic)
AuctionTypeSchema.virtual("users", {
  ref: "VisitorLog",
  localField: "_id",
  foreignField: "visitor_log_id",
  justOne: false,
});

// Export the AuctionType model
module.exports = mongoose.model("AuctionType", AuctionTypeSchema);
