const { default: mongoose } = require("mongoose")

const WarehouseTransferSchema = new mongoose.Schema({
  transfer_id: { type: String, unique: true, required: true }, // Unique transfer ID
  sender_warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  }, // Sender warehouse
  receiver_warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  }, // Receiver warehouse
  inventories: [],
  status: {
    type: String,
    enum: [
      "Pending",
      "In Transit",
      "Completed",
      "Confirm",
      "Processing",
      "Delivered",
    ],
    default: "Pending",
  }, // Transfer status
  payment_status: {
    type: String,
    enum: ["paid", "unpaid", "canceled", "overdue", "pending"],
    default: "pending",
  },
  location: {
    zip_code: { type: String }, // Zip code for routing
    address: { type: String },
    coordinates: { type: { lat: Number, lng: Number } }, // Geo-coordinates
  },
  exportQR: { type: String },
  importerQR: { type: String },
  productPDFPath: { type: String },
  exportPDFPath: { type: String },
  importerRequestDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

WarehouseTransferSchema.pre("save", function (next) {
  this.qr_code = JSON.stringify({
    transfer_id: this.transfer_id,
    sender_warehouse: this.sender_warehouse,
    receiver_warehouse: this.receiver_warehouse,
    products: this.products,
  })
  next()
})

module.exports = mongoose.model("WarehouseTransfer", WarehouseTransferSchema)
