const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductTagSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  tag_id: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
});

module.exports = mongoose.model("ProductTag", ProductTagSchema);
