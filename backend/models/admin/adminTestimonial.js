const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminTestimonialSchema = new Schema(
  {
    content: { type: String, required: true },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Export the AdminTestimonial model
module.exports = mongoose.model("AdminTestimonial", AdminTestimonialSchema);
