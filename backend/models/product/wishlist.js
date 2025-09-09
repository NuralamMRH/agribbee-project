const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    item_type: { type: String },
    item_id: { type: Schema.Types.ObjectId, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Polymorphic relationship for items
wishlistSchema.virtual("item", {
  refPath: "item_type",
  localField: "item_id",
  justOne: true,
});

// Export the Cart model
module.exports = mongoose.model("Wishlist", wishlistSchema);
