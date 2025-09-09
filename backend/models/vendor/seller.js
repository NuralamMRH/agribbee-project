const mongoose = require("mongoose")
const { Schema } = mongoose
const ErrorHandler = require("../../utils/errorHandler")

// Define the schema structure for multilingual content
const translatedFields = {}
const languages = ["vi", "en"] // Example language config

const sellerSchema = new Schema(
  {
    name: { type: String },
    description: { type: String, required: false },
    meta_title: { type: String, required: false },
    meta_description: { type: String, required: false },
    announcement_message: { type: String, required: false },
    seller_type: { type: String, default: "kiosk" }, //G old VVIP:  OCOP/ Broker/ Auctioneer, Platinum Sourcers - VIP Sourcing membership ( ThuongLai/ Vựa Boss/Farmers/Fisherman ), Silver KioskOwners: WebKiosk membership
    selling_role: { type: String },
    image: { type: String, required: false },
    image_full_url: { type: String, required: false },
    banner: { type: String, required: false },
    banner_full_url: { type: String, required: false },
    seller_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: false,
      validate: {
        validator: function (value) {
          // Allow null, undefined, or valid ObjectId
          return !value || mongoose.Types.ObjectId.isValid(value)
        },
        message: (props) => `${props.value} is not a valid ObjectId!`,
      },
    },
    building: { type: String, required: false },
    address: {
      type: mongoose.Schema.Types.ObjectId,
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
        required: true,
        index: "2dsphere",
      },
    },
    status: {
      type: Number,
      default: 1, // 1 = active, 0 = disabled (for expired memberships)
    },
    slug: { type: String, required: false, unique: true },
    meta_image: { type: String, required: false },
    announcement: { type: Boolean, default: false },
    delivery: { type: Boolean, default: false },
    take_away: { type: Boolean, default: false },
    product_section: { type: Boolean, default: true },
    auction_section: { type: Boolean, default: true },
    reviews_section: { type: Boolean, default: true },
    additional_data: { type: String, required: false },
    minimum_order: { type: Number, required: false },
    commission: { type: Number, required: false },
    tax: { type: Number, required: false },
    minimum_shipping_charge: { type: Number, required: false },
    per_km_shipping_charge: { type: Number, required: false },
    maximum_shipping_charge: { type: Number, required: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: false, // Expiration date of membership
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Relations
// Relations (Virtuals)

sellerSchema.virtual("warehouses", {
  ref: "Warehouse",
  localField: "_id",
  foreignField: "seller_id",
})

sellerSchema.virtual("order_transaction", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "seller_id",
})

sellerSchema.virtual("todays_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "seller_id",
  match: { createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } },
})

sellerSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "seller_id",
})

sellerSchema.virtual("auctions", {
  ref: "Auction",
  localField: "_id",
  foreignField: "seller_id",
})

sellerSchema.virtual("this_week_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "seller_id",
  match: {
    createdAt: {
      $gte: new Date().setDate(new Date().getDate() - new Date().getDay()),
      $lt: new Date().setDate(new Date().getDate() + (6 - new Date().getDay())),
    },
  },
})

sellerSchema.virtual("this_month_earning", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "seller_id",
  match: {
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  },
})

sellerSchema.virtual("withdraw_requests", {
  ref: "WithdrawRequest",
  localField: "_id",
  foreignField: "seller_id",
})

// Slug Generation
sellerSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    // Try to generate the slug from the 'vi' name first
    let nameToSlugify = this.vi?.name || this.en?.name // Primary language is 'vi', fallback is 'en'

    if (nameToSlugify) {
      this.slug = await this.generateSlug(nameToSlugify)
    }
  }
  next()
})

sellerSchema.methods.generateSlug = async function (name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "") // Replace spaces and special characters
  const existingSlug = await this.constructor
    .findOne({ slug: new RegExp(`^${slug}`, "i") })
    .sort({ _id: -1 })

  if (existingSlug) {
    const lastSlug = existingSlug.slug
    const slugParts = lastSlug.split("-")
    const lastCount = parseInt(slugParts[slugParts.length - 1])

    if (isNaN(lastCount)) {
      slug = `${slug}-2` // Append '-2' if there's no numeric suffix
    } else {
      slug = `${slug}-${lastCount + 1}` // Increment the numeric suffix
    }
  }

  return slug
}

sellerSchema.set("toObject", { virtuals: true })
sellerSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Seller", sellerSchema)
