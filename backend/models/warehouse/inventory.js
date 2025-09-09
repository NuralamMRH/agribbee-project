const mongoose = require("mongoose");
const { Schema } = mongoose;

const InventorySchema = new Schema(
  {
    warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// To include the virtuals when converting to JSON or Object
InventorySchema.set("toObject", { virtuals: true });
InventorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Inventory", InventorySchema);
