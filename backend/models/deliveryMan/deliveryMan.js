const mongoose = require("mongoose")
const { Schema } = mongoose

const deliveryManSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle_id: { type: Number, required: true },
    vehicle_type: { type: String },
    vehicle_model: { type: String },
    zip: { type: Number, required: true },
    default_route: { from: "", to: "" },
    city: { type: Schema.Types.ObjectId, ref: "City", required: false },
    company: { type: String },
    status: { type: Boolean, default: true },
    active: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
    earning: { type: Number, default: 0.0 },
    current_orders: { type: Number, default: 0 },
    shift_id: { type: Number, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Add created_at and updated_at timestamps
  }
)

// Relations
deliveryManSchema.virtual("wallet", {
  ref: "DeliveryManWallet",
  localField: "_id",
  foreignField: "delivery_man_id",
  justOne: true,
})

deliveryManSchema.virtual("vehicle", {
  ref: "Vehicle",
  localField: "vehicle_id",
  foreignField: "_id",
  justOne: true,
})

deliveryManSchema.virtual("kiosk", {
  ref: "Kiosk",
  localField: "_id",
  foreignField: "_id",
  justOne: true,
})

deliveryManSchema.virtual("dm_shift", {
  ref: "Shift",
  localField: "shift_id",
  foreignField: "_id",
  justOne: true,
})

deliveryManSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "deliveryman_id",
})

deliveryManSchema.virtual("time_logs", {
  ref: "TimeLog",
  localField: "_id",
  foreignField: "user_id",
})

deliveryManSchema.virtual("order_transaction", {
  ref: "OrderTransaction",
  localField: "_id",
  foreignField: "deliveryman_id",
})

// Add custom methods for earnings
deliveryManSchema.methods.todays_earning = function () {
  return this.order_transaction.find({
    created_at: { $gte: new Date().setHours(0, 0, 0, 0) },
  })
}

deliveryManSchema.methods.this_week_earning = function () {
  const startOfWeek = new Date().setDate(
    new Date().getDate() - new Date().getDay()
  )
  const endOfWeek = new Date(startOfWeek).setDate(startOfWeek.getDate() + 6)
  return this.order_transaction.find({
    created_at: { $gte: startOfWeek, $lt: endOfWeek },
  })
}

// Scopes (static methods)
deliveryManSchema.statics.active = function () {
  return this.find({ active: 1, application_status: "approved" })
}

deliveryManSchema.statics.earning = function () {
  return this.find({ earning: 1 })
}

deliveryManSchema.statics.available = function () {
  return this.find({ current_orders: { $lt: config.dm_maximum_orders } })
}

const DeliveryMan = mongoose.model("DeliveryMan", deliveryManSchema)
module.exports = DeliveryMan
