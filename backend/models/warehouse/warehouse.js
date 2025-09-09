const mongoose = require("mongoose")
const { Schema } = mongoose

const WarehouseSchema = new Schema(
  {
    seller_id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    manager_id: { type: Schema.Types.ObjectId, ref: "User" },
    address_id: { type: Schema.Types.ObjectId, ref: "Address" },
    name: { type: String, required: true },
    zip: { type: String, required: true },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
    },
    qrCode: { type: String },
    isDefault: { type: Schema.Types.Boolean, required: false },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

WarehouseSchema.virtual("inventory", {
  ref: "Inventory",
  localField: "_id",
  foreignField: "warehouse_id",
  justOne: true,
})

// Relations (Virtuals)
WarehouseSchema.virtual("manager", {
  ref: "User",
  localField: "_id",
  foreignField: "assignedWarehouse",
  justOne: true,
})

// To include the virtuals when converting to JSON or Object
WarehouseSchema.set("toObject", { virtuals: true })
WarehouseSchema.set("toJSON", { virtuals: true })

let qrIncrement = 1 // Global increment variable
WarehouseSchema.pre("save", async function (next) {
  const order = this

  if (!order.qrCode) {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = String(date.getFullYear()).slice(-2)

    order.qrCode = `${order.name.slice(0, 2).toUpperCase()}/${order.zip
      .slice(0, 2)
      .toUpperCase()}/${day}/${month}/${year}/${String(qrIncrement).padStart(
      3,
      "0"
    )}`

    qrIncrement++ // Increment the QR counter
  }

  next()
})

module.exports = mongoose.model("Warehouse", WarehouseSchema)
