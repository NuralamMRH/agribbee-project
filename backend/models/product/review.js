const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema structure for multilingual content

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  image: { type: String },
  image_full_url: { type: String, unique: true },
});

// Static method to fetch active categories
ReviewSchema.statics.active = function () {
  return this.find({ status: 1 });
};

// Morph relationship with users (polymorphic)
ReviewSchema.virtual("users", {
  ref: "VisitorLog",
  localField: "_id",
  foreignField: "visitor_log_id",
  justOne: false,
});

// Export the Category model
module.exports = mongoose.model("Review", ReviewSchema);
