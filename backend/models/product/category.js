const mongoose = require("mongoose")
// const language = require("../config/language");
const { Schema } = mongoose

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    parent_id: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    position: { type: Number, default: 0 },
    priority: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    slug: { type: String, unique: true }, // Slug must be unique
    image: { type: String },
    image_full_url: { type: String },
    banner: { type: String },
    banner_full_url: { type: String },
    icon: { type: String },
    icon_full_url: { type: String },
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: { type: String },
    meta_image: { type: String },
    beverage: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Virtual to auto-calculate products count based on category
CategorySchema.virtual("products", {
  ref: "Product", // Assuming you have a Product model
  localField: "_id",
  foreignField: "category_id",
})

// Virtual to auto-calculate products count based on category
CategorySchema.virtual("auctions", {
  ref: "Auction", // Assuming you have a Product model
  localField: "_id",
  foreignField: "category_id",
})

CategorySchema.virtual("sellers", {
  ref: "Seller", // Assuming you have a Product model
  localField: "_id",
  foreignField: "seller_category",
  // This will return the count of products
})

// Virtual to auto-calculate child categories count
CategorySchema.virtual("totalChildren", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent_id",
  count: true, // This will return the count of child categories
})
// Virtual to auto-calculate child categories count
CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent_id",
})

CategorySchema.virtual("totalAuctions", {
  ref: "Auction",
  localField: "_id",
  foreignField: "category_id",
  count: true, // This will return the count of child categories
})
CategorySchema.virtual("totalProducts", {
  ref: "Product",
  localField: "_id",
  foreignField: "category_id",
  count: true, // This will return the count of child categories
})

// Populate `products_count` and `childes_count` before saving
CategorySchema.pre("save", async function (next) {
  const category = this

  // Update product count
  const productsCount = await mongoose
    .model("Product")
    .countDocuments({ category: category._id })
  category.products_count = productsCount

  // Generate slug if the name changes or it's new
  if (category.isNew || category.isModified("name")) {
    let nameToSlugify = category.name
    if (nameToSlugify) {
      category.slug = await category.generateSlug(nameToSlugify)
    }
  }

  next()
})

// Method to generate unique slug
CategorySchema.methods.generateSlug = async function (name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")

  const existingSlug = await this.constructor
    .findOne({ slug: new RegExp(`^${slug}`, "i") })
    .sort({ _id: -1 })

  if (existingSlug) {
    const lastSlug = existingSlug.slug
    const slugParts = lastSlug.split("-")
    const lastCount = parseInt(slugParts[slugParts.length - 1], 10)

    if (isNaN(lastCount)) {
      slug = `${slug}-2` // Append '-2' if no numeric suffix
    } else {
      slug = `${slug}-${lastCount + 1}` // Increment numeric suffix
    }
  }

  return slug
}

// Static method to fetch active categories
CategorySchema.statics.active = function () {
  return this.find({ status: 1 })
}

// Morph relationship with users (polymorphic)
CategorySchema.virtual("users", {
  ref: "VisitorLog",
  localField: "_id",
  foreignField: "visitor_log_id",
  justOne: false,
})

// Export the Category model
module.exports = mongoose.model("Category", CategorySchema)
