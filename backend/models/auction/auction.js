const mongoose = require("mongoose")
const { Schema } = mongoose

const AuctionSchema = new Schema(
  {
    name: { type: String },
    introduction: { type: String },
    description: { type: String },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please select correct product for auction"],
    },
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Seller id not defined for auction"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller id not defined for auction"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [],
    auction_type: {
      type: String,
      required: [true, "Please select correct auction type for auction"],
      default: "surplus-auction",
      enum: {
        values: [
          "surplus-auction",
          "live-auction",
          "future-delivery-auction",
          "daily-catch-auction",
        ],
        message: "Please select correct auction type for auction",
      },
    },
    buying_price: { type: Number, default: 0 },
    starting_bid_price: { type: Number, default: 0, required: false },
    current_bid_price: { type: Number, default: 0, required: false },
    min_bid_price: { type: Number, default: 0, required: false },
    max_bid_price: { type: Number, default: 0, required: false },
    reserve_bid_price: { type: Number, required: false },
    market_price: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }, // 0: inactive, 1: active
    auction_sku: { type: String, default: "" },
    avg_rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    size: { type: String },
    buying_quantity: { type: Number },
    selling_quantity: { type: Number },
    quantity_left: { type: Number },
    other_quantity_available: { type: Number, required: false },
    weight_unit: { type: String, default: "Kg" },
    weight: { type: Number, default: 0 },
    package: { type: String, default: "Case" },
    weight_min: { type: Number },
    weight_max: { type: Number },
    quantity_min: { type: Number, default: 0 },
    quantity_max: { type: Number },
    status: { type: String, default: "Warehouse storage" },
    warehouse_region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
    },
    phone_number: { type: String, required: false },
    warehouse_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
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
    isProductInWarehouse: { type: Boolean, default: false },
    isProduct: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    is_hot: { type: Boolean, default: false },
    is_new: { type: Boolean, default: false },
    is_best_seller: { type: Boolean, default: false },
    isProduction: { type: Boolean, default: false },
    isSendOffer: { type: Boolean, default: false },
    seller_phone: { type: String },
    zip_code: { type: String },
    lot_number: { type: String },
    sku: { type: String },
    image: { type: String },
    image_full_url: { type: String },
    images: [], // Array of image URLs
    production_date: { type: Date },
    expiration_date: { type: Date },
    starting_time: { type: Date, default: Date.now },
    ending_time: { type: Date },
    shipping_start_date: { type: Date },
    shipping_end_date: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    bids_count: { type: Number },
    slug: { type: String },
    isDeactivated: { type: Boolean, default: false },
    // Other fields you may need
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Logs relationship
AuctionSchema.virtual("logs", {
  ref: "Log",
  localField: "_id",
  foreignField: "model_id",
  match: { model: "Auction" },
})

// Cart relationship (polymorphic equivalent in Mongoose)
AuctionSchema.virtual("bids", {
  ref: "bid",
  localField: "_id",
  foreignField: "auction_id",
  count: true,
})

AuctionSchema.virtual("seller", {
  ref: "Seller",
  localField: "seller_id",
  foreignField: "_id",
  justOne: true,
})

AuctionSchema.virtual("product", {
  ref: "Product",
  localField: "product_id",
  foreignField: "_id",
  justOne: true,
})

// Category relationship
AuctionSchema.virtual("category", {
  ref: "Category",
  localField: "category_id",
  foreignField: "_id",
  justOne: true,
})

AuctionSchema.virtual("region", {
  ref: "Region",
  localField: "warehouse_region",
  foreignField: "_id",
  justOne: true,
})

AuctionSchema.virtual("warehouse", {
  ref: "Address",
  localField: "warehouse_address",
  foreignField: "_id",
  justOne: true,
})

// Active scope
AuctionSchema.statics.active = function () {
  return this.find({ status: 1 }).populate("seller", { status: 1 })
}

// Available scope
AuctionSchema.statics.available = function (time) {
  return this.find({
    available_time_starts: { $lte: time },
    available_time_ends: { $gte: time },
  })
}

// Popular scope
AuctionSchema.statics.popular = function () {
  return this.find().sort({ bids_count: -1 })
}

// Reviews relationship
// AuctionSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "review_id",
//   options: { sort: { created_at: -1 } },
// });

// Vendor relationship
AuctionSchema.virtual("seller", {
  ref: "Seller",
  localField: "seller_id",
  foreignField: "_id",
  justOne: true,
})

// Category relationship
AuctionSchema.virtual("category", {
  ref: "Category",
  localField: "category_id",
  foreignField: "_id",
  justOne: true,
})

AuctionSchema.virtual("region", {
  ref: "Region",
  localField: "warehouse_region",
  foreignField: "_id",
  justOne: true,
})

AuctionSchema.virtual("warehouse", {
  ref: "Address",
  localField: "warehouse_address",
  foreignField: "_id",
  justOne: true,
})
// Orders relationship
AuctionSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "auction_id",
  justOne: false,
})

// Slug Generation before save
AuctionSchema.pre("save", async function (next) {
  const auction = this

  // Update order count
  const ordersCount = await mongoose
    .model("Bid")
    .countDocuments({ auction_id: auction._id })
  auction.bids_count = ordersCount

  // Check if the auction is new or the name in the language is modified
  if (
    auction.isNew ||
    auction.isModified("name") ||
    auction.isModified("slug")
  ) {
    // Generate the slug from the first available language field (start with 'vi')
    if (auction.slug) {
      auction.slug = await auction.generateSlug(auction.slug)
    } else {
      auction.slug = await auction.generateSlug(auction.name)
    }

    // Generate unique name dynamically for the current language
    if (auction.name) {
      auction.name = await auction.generateUniqueName(auction.name)
    }
  }

  next()
})

// Method to generate unique slug
AuctionSchema.methods.generateSlug = async function (name) {
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

// Method to generate a unique name
AuctionSchema.methods.generateUniqueName = async function (name) {
  let baseName = name // Store the original name to use when appending count
  let count = 1
  let existingAuction

  // Keep checking for existing names until no match is found
  do {
    // Create a new name if count > 1
    const newName = count > 1 ? `${baseName}-${count}` : baseName

    // Check if there's an existing auction with this name in the given language field (vi.name or en.name)
    existingAuction = await this.constructor.findOne({
      name: new RegExp(`^${newName}$`, "i"),
    })

    if (existingAuction) {
      count++ // Increment the count if a match is found
    } else {
      return newName // Return the unique name if no match is found
    }
  } while (existingAuction)

  return baseName // Fallback, should never be hit
}

// Export the Auction model
module.exports = mongoose.model("Auction", AuctionSchema)
