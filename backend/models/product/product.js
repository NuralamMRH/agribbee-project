const mongoose = require("mongoose")
const { Schema } = mongoose

// Define the Product schema
const ProductSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    introduction: { type: String },
    sku: { type: String, required: true, default: "" },
    taxes: { type: Boolean, default: true },
    tax: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    isNegotiable: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
    buying_quantity: { type: Number, default: 0 },
    sold_quantity: { type: Number, default: 1 },
    quantity_left: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    weight: { type: Number, default: 10 },
    weight_unit: { type: String, default: "kg" }, // kg, g, lb, oz
    package: { type: String, default: "Case" },
    status: { type: String, default: "Warehouse storage" },
    discount: { type: Number, default: 0 },
    avg_rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    order_count: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    min: { type: Number },
    max: { type: Number },
    maximum_cart_quantity: { type: Number, default: 0 },
    recommended: { type: Number, default: 0 }, // 1: recommended, 0: not recommended
    image: { type: String },
    image_full_url: { type: String },
    images: [], // Array of image URLs
    videos: [],
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [],
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },

    slug: { type: String, unique: true },
    is_featured: { type: Boolean, default: false },
    is_hot: { type: Boolean, default: false },
    is_new: { type: Boolean, default: false },
    is_best_seller: { type: Boolean, default: false },
    is_sale: { type: Boolean, default: false },
    seller_phone: { type: String },
    zip_code: { type: String },
    warehouse_region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
    },
    isProductInWarehouse: { type: Schema.Types.Boolean },
    warehouse_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    production_date: { type: Date },
    expiration_date: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    auctions_count: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Logs relationship
ProductSchema.virtual("logs", {
  ref: "Log",
  localField: "_id",
  foreignField: "model_id",
  match: { model: "Product" },
})

// Cart relationship (polymorphic equivalent in Mongoose)
ProductSchema.virtual("carts", {
  ref: "Cart",
  localField: "_id",
  foreignField: "item",
  justOne: false,
})

// Active scope
ProductSchema.statics.active = function () {
  return this.find({ status: 1 }).populate("vendor", { status: 1 })
}

// Available scope
ProductSchema.statics.available = function (time) {
  return this.find({
    available_time_starts: { $lte: time },
    available_time_ends: { $gte: time },
  })
}

// Popular scope
ProductSchema.statics.popular = function () {
  return this.find().sort({ order_count: -1 })
}

// Reviews relationship
// ProductSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product_id",
//   options: { sort: { created_at: -1 } },
// });

// Vendor relationship
ProductSchema.virtual("seller", {
  ref: "Seller",
  localField: "seller_id",
  foreignField: "_id",
  justOne: true,
})

// Category relationship
ProductSchema.virtual("category", {
  ref: "Category",
  localField: "category_id",
  foreignField: "_id",
  justOne: true,
})

ProductSchema.virtual("region", {
  ref: "Region",
  localField: "warehouse_region",
  foreignField: "_id",
  justOne: true,
})

ProductSchema.virtual("warehouse", {
  ref: "Address",
  localField: "warehouse_address",
  foreignField: "_id",
  justOne: true,
})

// Orders relationship
ProductSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "product_id",
  justOne: false,
})

// Slug Generation before save
ProductSchema.pre("save", async function (next) {
  const product = this

  // Update order count
  const ordersCount = await mongoose
    .model("Order")
    .countDocuments({ product_id: product._id })
  product.order_count = ordersCount

  const auctions_count = await mongoose
    .model("Auction")
    .countDocuments({ auctions_count: product._id })
  product.auctions_count = auctions_count

  // Generate slug if the product is new or the name is modified
  if (
    product.isNew ||
    product.isModified("name") ||
    product.isModified("slug")
  ) {
    // Generate the slug from the first available language field (start with 'vi')
    if (product.slug) {
      product.slug = await product.generateSlug(product.slug)
    } else {
      product.slug = await product.generateSlug(product.name)
    }
  }

  // If 'vi' name does not exist, fallback to other available   for slug generation
  if (!product.slug) {
    if (product.name) {
      product.slug = await product.generateSlug(product.name)
    }
  } else {
    product.slug = await product.generateSlug(product.slug)
  }

  next()
})

// Method to generate unique slug
ProductSchema.methods.generateSlug = async function (name) {
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

ProductSchema.methods.generateUniqueName = async function (name) {
  let baseName = name // Store the original name to use when appending count
  let count = 1
  let existingProduct

  // Keep checking for existing names until no match is found
  do {
    // Create a new name if count > 1
    const newName = count > 1 ? `${baseName}-${count}` : baseName

    // Check if there's an existing product with this name in the given   field (vi.name or en.name)
    existingProduct = await this.constructor.findOne({
      name: new RegExp(`^${newName}$`, "i"),
    })

    if (existingProduct) {
      count++ // Increment the count if a match is found
    } else {
      return newName // Return the unique name if no match is found
    }
  } while (existingProduct)

  return baseName // Fallback, should never be hit
}

// Export the Product model
module.exports = mongoose.model("Product", ProductSchema)
