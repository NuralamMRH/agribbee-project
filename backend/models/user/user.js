const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// User Schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "warehouse_manager", "seller", "exporter", "guest"],
    default: "guest", // Default role
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  f_name: {
    type: String,
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  l_name: {
    type: String,
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },

  company_name: {
    type: String,
    required: false,
    maxLength: [30, "Your company cannot exceed 30 characters"],
  },

  login_medium: {
    type: String,
    required: false,
  },
  ref_code: {
    type: String,
    required: false,
  },
  ref_by: {
    type: String,
    required: false,
  },
  social_id: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: [false, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPackage",
    required: false,
  },
  membershipExpiry: {
    type: Date,
    required: false, // Set when a vendor's membership will expire
  },
  isSubscribed: {
    type: Boolean,
    default: false, // When a vendor subscribes, this will be true
  },
  is_email_verified: { type: Number, default: 0 },
  is_phone_verified: { type: Number, default: 0 },
  wallet_balance: {
    type: Number,
    default: 0,
  },
  loyalty_point: {
    type: Number,
    default: 0,
  },
  payment_verified: { type: Boolean, default: false },
  id_verified: { type: Boolean, default: false },
  id_card_number: { type: String, default: "" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  image: { type: String },
  image_full_url: { type: String },
  guest_id: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

// To include the virtuals when converting to JSON or Object
userSchema.set("toObject", { virtuals: true })
userSchema.set("toJSON", { virtuals: true })

// Relations (Virtuals)
userSchema.virtual("subscription", {
  ref: "SubscriptionPackage",
  localField: "membership",
  foreignField: "_id",
  justOne: true,
})

userSchema.virtual("seller", {
  ref: "Seller",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
})

userSchema.virtual("warehouses", {
  ref: "User",
  localField: "assignedWarehouse",
  foreignField: "_id",
  match: { role: "warehouse_manager" },
})

userSchema.virtual("order_transaction", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "vendor_id",
})

// Relationships
userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user_id",
})

userSchema.virtual("address", {
  ref: "Address",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
})
userSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "user_id",
})

userSchema.virtual("loyalty_point_transactions", {
  ref: "LoyaltyPointTransaction",
  localField: "_id",
  foreignField: "user_id",
})

userSchema.virtual("wallet", {
  ref: "UserWallet",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
})

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  if (!this.username) {
    this.username = await this.generateSlug(this.f_name + " " + this.l_name)
  }

  if (!this.password) {
    this.password = await this.generatePassword()
  }

  this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role, // Include the role in the payload
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  )
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
  return resetToken
}

userSchema.methods.generateSlug = async function (name) {
  let username = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")

  const existingUsername = await this.constructor
    .findOne({ username: new RegExp(`^${username}`, "i") })
    .sort({ _id: -1 })

  if (existingUsername) {
    const lastUsername = existingUsername.username
    const usernameParts = lastUsername.split("-")
    const lastCount = parseInt(usernameParts[usernameParts.length - 1], 10)

    if (isNaN(lastCount)) {
      username = `${username}-2` // Append '-2' if no numeric suffix
    } else {
      username = `${username}-${lastCount + 1}` // Increment numeric suffix
    }
  }

  return username
}

// Generate a random password if none is provided
userSchema.methods.generatePassword = async function () {
  const chars = process.env.PASSWORD_GENERATION
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

module.exports = mongoose.model("User", userSchema)
